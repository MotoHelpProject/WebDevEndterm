from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import HelpRequest

User = get_user_model()

DEMO_USERS = [
    {'username': 'rider_demo', 'password': 'demo1234', 'phone': '+77001234567'},
    {'username': 'helper_demo', 'password': 'demo1234', 'phone': '+77007654321'},
]

DEMO_REQUESTS = [
    {'category': 'GAS',  'lat': 51.1800, 'lon': 71.4460, 'description': 'Ran out of fuel near the highway.'},
    {'category': 'TOOL', 'lat': 51.1750, 'lon': 71.4510, 'description': 'Need a wrench to fix a chain.'},
    {'category': 'EVAC', 'lat': 51.1820, 'lon': 71.4390, 'description': 'Engine stopped, need towing.'},
]


class Command(BaseCommand):
    help = 'Seed demo users and help requests for presentation'

    def handle(self, *args, **kwargs):
        users = []
        for data in DEMO_USERS:
            user, created = User.objects.get_or_create(username=data['username'])
            if created:
                user.set_password(data['password'])
                user.phone = data['phone']
                user.latitude = 51.18
                user.longitude = 71.45
                user.is_online = True
                user.save()
                self.stdout.write(f'Created user: {user.username}')
            else:
                self.stdout.write(f'User already exists: {user.username}')
            users.append(user)

        requester = users[0]
        HelpRequest.objects.filter(requester=requester).delete()

        for req in DEMO_REQUESTS:
            HelpRequest.objects.create(
                requester=requester,
                category=req['category'],
                latitude=req['lat'],
                longitude=req['lon'],
                description=req['description'],
                status='PENDING',
                radius_km=20,
            )
            self.stdout.write(f'Created {req["category"]} request')

        self.stdout.write(self.style.SUCCESS(
            '\nDemo data ready!\n'
            f'  requester: {DEMO_USERS[0]["username"]} / {DEMO_USERS[0]["password"]}\n'
            f'  helper:    {DEMO_USERS[1]["username"]} / {DEMO_USERS[1]["password"]}\n'
        ))
