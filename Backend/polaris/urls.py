from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users/<int:pk>/", views.UserDetail.as_view()),
    path('users/', views.UserList.as_view(), name='list-of-users'),
    path('users/login/', views.login, name='login'),
    path('users/register/', views.register, name='register'),

    path("observations/<int:pk>/", views.ObservationDetail.as_view(), name='observation-detail'),
    path('observations-user/<int:user_id>/', views.ObservationList.as_view(), name='list-of-observations-of-a-user'),
    path('observations/', views.AllObservationList.as_view(), name='list-of-observations'),
    path('stars/', views.StarList.as_view(), name='list-of-stars'),
    path('stars/<int:pk>/', views.StarDetail.as_view(), name='list-of-stars'),

    path('equipments/', views.EquipmentList.as_view(), name='list-of-equipments'),
    path('skyconditions/', views.SkyConditionList.as_view(), name='list-of-sky-conditions'),
    path('skyconditions/<int:pk>/', views.SkyConditionDetail.as_view(), name='sky-condition-detail'),
    path('equipments/<int:pk>/', views.EquipmentDetail.as_view(), name='equipment-detail'),
    path('get-sky-condition-id/<name>/', views.get_sky_condition_id, name='get_sky_condition_id'),
    path('get-equipment-id/<name>/', views.get_equipment_id, name='get_equipment_id'),
    path('get-user-id/<username>/', views.get_user_id, name='get_user _id'),
    path('get-followers/<id>/', views.get_followers, name='get_followers'),
    path('get-equipment-id/<name>/', views.get_equipment_id, name='get_equipment_id'),
    path('userprofiles/', views.UserProfileList.as_view(), name='list-of-user-profiles'),
    path('userprofiles/<int:user_id>/', views.UserProfileDetail.as_view(), name='user-profile-detail'),
    path('images/', views.ImageList.as_view(), name='list-of-images'),
    path('images/<int:pk>', views.ImageDetail.as_view(), name='image-detail'),
    path('images/<name>/', views.get_image, name='get_image'),
    path('follow/<int:from_user_id>/<int:to_user_id>/', views.follow_user, name='follow_user'),
    path('unfollow/<int:from_user_id>/<int:to_user_id>/', views.unfollow_user, name='unfollow_user'),

    path('get-best-observation-times/<str:latitude>/<str:longitude>/<str:planet_name>/<int:number_of_days>/', views.get_best_observation_times),
    path('lunar-eclipse-prediction/<latitude>/<longitude>/<int:number_of_days>/', views.lunar_eclipse_prediction, name='lunar_eclipse_prediction'),
    path('solar-eclipse-prediction/<latitude>/<longitude>/<int:number_of_days>/', views.solar_eclipse_prediction, name='solar_eclipse_prediction'),

    path('get-best-observation-times-and-lunar-eclipse/<str:latitude>/<str:longitude>/<str:planet_names>/<int:number_of_days>/<str:preferred_hour>/', views.get_best_observation_times_and_lunar_eclipse),
    path('get-best-observation-times-and-solar-eclipse/<str:latitude>/<str:longitude>/<str:planet_names>/<int:number_of_days>/<str:preferred_hour>/', views.get_best_observation_times_and_solar_eclipse),
    path('get-lunar-solar-eclipse/<latitude>/<longitude>/<int:number_of_days>/<str:preferred_hour>/', views.get_lunar_solar_eclipse),
    path('get-best-times-and-lunar-solar-eclipse/<str:latitude>/<str:longitude>/<str:planet_names>/<int:number_of_days>/<str:preferred_hour>/', views.get_best_times_and_lunar_solar_eclipse),
    path('get-lunar-eclipses-events/<str:latitude>/<str:longitude>/<int:number_of_days>/<str:preferred_hour>/', views.get_lunar_eclipses_events),
    path('get-solar-eclipses-events/<str:latitude>/<str:longitude>/<int:number_of_days>/<str:preferred_hour>/', views.get_solar_eclipses_events),
    path('get-planets-observation-times/<str:latitude>/<str:longitude>/<str:planet_names>/<int:number_of_days>/<str:preferred_hour>/', views.get_planets_observation_times),
    path('events/', views.EventList.as_view(), name='list-of-events'),
    path('events/<int:pk>/', views.EventDetail.as_view(), name='event-detail'),
    path('send-invitation/', views.send_invitation, name='send_invitation'),
    path('events-user/<int:organizer>/', views.EventList.as_view(), name='list-of-events-of-a-user'),
    path('equipment/<str:observation_type>/', views.get_equipment_list, name='equipment_list'),
    path('notifications/', views.NotificationList.as_view(), name='list-of-notifications'),
    path('notifications/<int:pk>/', views.NotificationDetail.as_view(), name='notification-detail'),
    path('notifications-user/<int:user_id>/', views.NotificationUserList.as_view(),name='list-of-notifications-of-a-user'),
    path('planets/', views.PlanetList.as_view(), name='list-of-planets'),
    path('constellations/', views.ConstellationList.as_view(), name='list-of-constellations'),
    path('forgot-password/', views.send_forgot_password, name='forgot-password'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('chats/', views.ChatList.as_view(), name='list-of-chats'),
    path('messages/', views.MessageList.as_view(), name='list-of-messages'),
    path('chats/<int:pk>/', views.ChatDetail.as_view(), name='chat-detail'),
    path('messages/<int:pk>/', views.MessageDetail.as_view(), name='message-detail'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
