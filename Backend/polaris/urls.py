from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users/<int:pk>/", views.UserDetail.as_view()),
    path('users/', views.UserList.as_view(), name='list-of-users'),
    path('users/login/', views.login, name='login'),
    path('users/register/', views.register, name='register'),

    path("observations/<int:user_id>/<int:pk>/", views.ObservationDetail.as_view()),
    path('observations/<int:user_id>/', views.ObservationList.as_view(), name='list-of-observations-of-a-user'),
    path('observations/', views.AllObservationList.as_view(), name='list-of-observations'),

    path('equipments/', views.EquipmentList.as_view(), name='list-of-equipments'),
    path('skyconditions/', views.SkyConditionList.as_view(), name='list-of-skyconditions'),
    path('skyconditions/<int:pk>/', views.SkyConditionDetail.as_view(), name='skycondition-detail'),
    path('get-sky-condition-id/<name>/', views.get_sky_condition_id, name='get_sky_condition_id'),
    path('get-equipment-id/<name>/', views.get_equipment_id, name='get_equipment_id')
]
