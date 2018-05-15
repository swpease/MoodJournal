from .base import *

import dj_database_url

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-python
DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=True)

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# STATIC_URL = '/static/'  # Defined in base.txt

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

ALLOWED_HOSTS = ['.herokuapp.com', '.categoricaljournal.com']

WEBPACK_LOADER = {
    'DEFAULT': {
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.prod.json'),
        }
}

#Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True