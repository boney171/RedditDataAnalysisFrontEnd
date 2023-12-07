from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('graph/', views.graph, name='graph'),
    path('average/', views.average, name='average'),
    path('insights/', views.insights, name='insights'),
]