from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/prompts/', include('apps.prompts.urls')),
    path('api/v1/rankings/', include('apps.rankings.urls')),
    path('api/v1/benchmarks/', include('apps.benchmarks.urls')),
]