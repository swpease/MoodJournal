"""MoodJournal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

from rest_framework_jwt.views import refresh_jwt_token

from .AuthCust import views as auth_cust_views

urlpatterns = [
    url(r'^api/', include('entries.urls')),
    url(r'^admin/', admin.site.urls),

    url(r'^rest-auth/registration/resend-verification-email/$',
        auth_cust_views.resend_verification_email,
        name='resend-verification-email'),
    # per FAQ http://django-rest-auth.readthedocs.io/en/latest/faq.html
    url(r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        auth_cust_views.null_view,
        name='password_reset_confirm'),

    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^refresh-token/', refresh_jwt_token),
    url('^$', TemplateView.as_view(template_name="index.html")),
]

urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
]