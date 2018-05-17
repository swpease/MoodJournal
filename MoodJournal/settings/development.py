from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': get_env_variable('DB_NAME'),
        'USER': get_env_variable('DB_USER'),
        'PASSWORD': get_env_variable('DB_PASSWORD'),
        'HOST': '',
        'PORT': '',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# For React integration
# TODO may need to change for production?
WEBPACK_LOADER = {
    'DEFAULT': {
            # Don't really need to specify BUNDLE_DIR_NAME, B/C:
            # https://github.com/ezhome/django-webpack-loader/blob/master/webpack_loader/loader.py
            # Look at 'get_chunk_url'... as long as the webpack-stats file has the publicPath keys,
            # it'll just use that to create the urls in the template.
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.dev.json'),
        }
}