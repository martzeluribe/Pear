from odoo import models, fields

class PisoUserLotura(models.Model):
    _name = 'pisos.lotura'
    _description = 'Pisu eta Erabiltzaile Lotura'
    _order = 'create_date desc'

    # Loturak
    piso_id = fields.Many2one('pisos.piso', string='Etxebizitza', required=True, ondelete='cascade')
    user_id = fields.Many2one('res.users', string='Erabiltzailea', required=True, ondelete='cascade')

    # Oharra: id, create_date eta write_date eremuak Odoon existitzen dira jada.
    # Ez da beharrezkoa hemen berriro definitzea, baina bistan erakutsiko ditugu.