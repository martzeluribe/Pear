from odoo import models, fields, api
from odoo.exceptions import ValidationError
import re

class Piso(models.Model):
    _name = 'pisos.piso'
    _description = 'Etxebizitza'
    _order = 'create_date desc'

    # --- Laguntzaile eremua (Interfazerako bakarrik) ---
    # Eremu honek esaten digu ea konektatuta dagoena Super-Admina den ala ez
    is_current_user_admin = fields.Boolean(
        compute='_compute_is_current_user_admin', 
        store=False
    )

    @api.depends_context('uid') # Erabiltzailearen arabera kalkulatzen da
    def _compute_is_current_user_admin(self):
        for record in self:
            # 'base.group_system' da Odoon baimen guztiak dituena (Ajustes)
            record.is_current_user_admin = self.env.user.has_group('base.group_system')

    # --- Datu Eremuak ---
    name = fields.Char(string='Izena', required=True)
    
    codigo = fields.Char(
        string='Kodea', 
        required=True, 
        help="10 karaktere alfanumeriko."
    )
    
    descripcion = fields.Text(string='Deskribapena')
    direccion = fields.Char(string='Helbidea')
    
    # Jabea: Defektuz sortzen duen erabiltzailea da.
    admin_id = fields.Many2one(
        'res.users', 
        string='Jabea', 
        default=lambda self: self.env.user, # Automatikoki zu zara
        required=True
    )

    # --- Baliozkotzeak ---
    @api.constrains('codigo')
    def _check_codigo(self):
        for record in self:
            if len(record.codigo) != 10:
                raise ValidationError("Errorea: Kodeak 10 karaktere izan behar ditu.")
            if not re.match("^[a-zA-Z0-9]*$", record.codigo):
                raise ValidationError("Errorea: Kodeak letrak eta zenbakiak soilik onartzen ditu.")