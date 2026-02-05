from odoo import models, fields, api
from odoo.exceptions import AccessError

class ResUsers(models.Model):
    _inherit = 'res.users'

    mota = fields.Selection([
        ('admina', 'Admina'),
        ('erabiltzailea', 'Erabiltzailea')
    ], string='Rol Laravel', default='erabiltzailea', required=True)

    # ---------------------------------------------------------
    # 1. BLOQUEAR BORRADO (UNLINK) - NADIE BORRA
    # ---------------------------------------------------------
    def unlink(self):
        if self.env.user.mota == 'erabiltzailea':
            raise AccessError("⛔ Ezabatzea ukatua!Ezin duzu erabiltzailerik ezabatu.")
        return super(ResUsers, self).unlink()

    # ---------------------------------------------------------
    # 2. BLOQUEAR CREACIÓN (CREATE) - NADIE CREA
    # ---------------------------------------------------------
    @api.model
    def create(self, vals):
        if not self.env.su and self.env.user.mota == 'erabiltzailea':
             raise AccessError("⛔ Sortzea ukatua! Ezin duzu erabiltzaile berririk sortu.")

        user = super(ResUsers, self).create(vals)
        user.sudo()._update_laravel_role_permissions()
        return user

    # ---------------------------------------------------------
    # 3. EDICIÓN CONTROLADA (WRITE) - AQUÍ ESTÁ EL CAMBIO
    # ---------------------------------------------------------
    def write(self, vals):
        user_actual = self.env.user

        # --- CASO A: SOY UN USUARIO NORMAL ('ERABILTZAILEA') ---
        if not self.env.su and user_actual.mota == 'erabiltzailea':
            
            # 1. ¿A QUIÉN ESTOY EDITANDO?
            for record in self:
                if record.id != user_actual.id:
                    # Si el ID del usuario que toco NO es el mío -> ERROR
                    raise AccessError("⛔ Geldi! Zure profila bakarrik editatu dezakezu.")

            # 2. PROHIBIDO ESCALAR PRIVILEGIOS
            # Si intenta cambiarse a 'admina' él mismo -> ERROR
            if 'mota' in vals:
                 raise AccessError("⛔ Ezin duzu zure rola aldatu.")

            # 3. LIMPIEZA DE GRUPOS
            # Si la interfaz intenta mandar cambios de grupos, los borramos silenciosamente
            # para que pueda guardar su nombre/pass sin que Odoo se queje de permisos.
            if 'groups_id' in vals:
                del vals['groups_id']

        # --- CASO B: SOY ADMIN (O EL SISTEMA) ---
        # Solución al conflicto de interfaz cuando el Admin cambia roles
        if 'mota' in vals and 'groups_id' in vals:
            del vals['groups_id']

        # --- GUARDAR DATOS ---
        res = super(ResUsers, self).write(vals)

        # --- ACTUALIZAR PERMISOS SI CAMBIÓ LA MOTA (SOLO ADMIN) ---
        if 'mota' in vals:
            for user in self:
                user.sudo()._update_laravel_role_permissions()
        
        return res

    # ---------------------------------------------------------
    # AUXILIAR: GESTIÓN DE GRUPOS
    # ---------------------------------------------------------
    def _update_laravel_role_permissions(self):
        group_admin = self.env.ref('base.group_system')
        group_rights = self.env.ref('base.group_erp_manager')

        for user in self:
            if user.mota == 'admina':
                user.write({'groups_id': [(4, group_admin.id), (4, group_rights.id)]})
            elif user.mota == 'erabiltzailea':
                user.write({'groups_id': [(3, group_admin.id), (3, group_rights.id)]})