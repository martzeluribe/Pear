{
    'name': 'Pisu eta Erabiltzaile Loturak',
    'version': '1.0',
    'summary': 'Pisuak eta Erabiltzaileak lotzeko taula',
    'category': 'Extra Tools',
    'author': 'Pear taldea',
    'depends': ['base', 'kudeaketa_pisos'],  # Zure pisu modulua behar du!
    'data': [
        'security/ir.model.access.csv',
        'views/lotura_views.xml',
    ],
    'installable': True,
    'application': True,
}