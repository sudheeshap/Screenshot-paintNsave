from django.conf.urls import patterns, include, url
from paint_it.views import * 
import settings

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', home),
    url(r'^(?P<pic_name>[\w]+).jpg$', show_pic),
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    # Examples:
    # url(r'^$', 'pic_paint.views.home', name='home'),
    # url(r'^pic_paint/', include('pic_paint.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
