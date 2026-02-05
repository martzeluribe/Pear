# __manifest__.py
{
    'name': 'Laravel Erabiltzaileen Konexioa',      # Antes: Conexión Usuarios Laravel
    'version': '1.0',
    'summary': 'Laravelekin integratzeko erabiltzaileen luzapena',  # Antes: Extensión de usuarios...
    'category': 'Integrazioa',                      # Antes: Integration
    'author': 'Pear taldea',                         # Antes: Tu Nombre
    'depends': ['base'],
    'data': [
        'security/security.xml',
        'views/res_users_views.xml',
    ],
    'installable': True,
    'application': True,
}