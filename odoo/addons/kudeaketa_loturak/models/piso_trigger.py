from odoo import models, api

class PisoTrigger(models.Model):
    _inherit = 'pisos.piso'  # Aurreko moduluko modeloa heredatzen dugu

    @api.model
    def create(self, vals):
        # 1. Pisua sortu (normaltasunez)
        piso = super(PisoTrigger, self).create(vals)
        
        # 2. Lotura sortu automatikoki
        # Pisua sortu berri dugu, beraz 'piso.id' eta 'piso.admin_id.id' baditugu.
        self.env['pisos.lotura'].create({
            'piso_id': piso.id,
            'user_id': piso.admin_id.id, # Pisuaren jabea (admin_id) erabiltzen dugu
        })
        
        return piso