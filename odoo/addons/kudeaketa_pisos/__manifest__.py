{
    'name': 'Etxebizitza Kudeaketa',
    'version': '1.0',
    'summary': 'Pisu eta apartamentuen kudeaketa aurreratua',
    'category': 'Higiezinak',  # Real Estate
    'author': 'Pear taldea',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'security/security.xml',
        'views/piso_views.xml',
    ],
    'application': True,
    'installable': True,
}