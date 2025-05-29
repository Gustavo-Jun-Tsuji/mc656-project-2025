from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Route


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        def add_user(username, email, password):
            user, created = User.objects.get_or_create(username=username, email=email)
            if created:
                user.set_password(password)
                user.save()
                self.stdout.write(f"User {username} created.")
            else:
                self.stdout.write(f"User {username} already exists.")

        def add_route(
            user,
            title,
            description,
            starting_location,
            ending_location,
            coordinates,
            tags=None,
            image=None,
        ):
            existing_route = Route.objects.filter(user=user, title=title).first()

            if existing_route:
                self.stdout.write(
                    f"Route '{title}' already exists for {user.username}."
                )
                return existing_route
            else:
                route = Route.objects.create(
                    user=user,
                    title=title,
                    description=description,
                    starting_location=starting_location,
                    ending_location=ending_location,
                    coordinates=coordinates,
                    tags=tags or [],
                    image=image,
                )
                self.stdout.write(f"Route '{title}' created by {user.username}.")

        add_user("Dummy", "d@email.com", "123")
        add_user("Sunny", "s@email.com", "123")
        add_user("Mummy", "m@email.com", "123")
        add_user("Bunny", "b@email.com", "123")
        add_user("Funny", "f@email.com", "123")
        add_user("Runny", "r@email.com", "123")
        add_user("Honey", "h@email.com", "123")
        add_user("Nanny", "n@email.com", "123")

        add_route(
            user=User.objects.get(username="Sunny"),
            title="Pikachu!",
            description="Uma rota criada pelo Sunny.",
            starting_location="?",
            ending_location="?",
            coordinates=[
                [-22.8173863766176, -47.07088096070433],
                [-22.815902980056652, -47.071888424536425],
                [-22.815012934364745, -47.071845553735066],
                [-22.814300893623475, -47.071073879310475],
                [-22.812916359304218, -47.071073879310475],
                [-22.811986735507453, -47.07002354467701],
                [-22.81121534073216, -47.071073879310475],
                [-22.808960469420803, -47.072574357358285],
                [-22.807279181436623, -47.07276727596443],
                [-22.80816927765972, -47.07163119972823],
                [-22.810226366681654, -47.07008785087905],
                [-22.81137357591398, -47.06968057826608],
                [-22.81079997250543, -47.068523066629204],
                [-22.81076041356064, -47.066615315968406],
                [-22.81169004572621, -47.06560785213631],
                [-22.811116443650207, -47.06384970385157],
                [-22.81085931090107, -47.06136319737235],
                [-22.811314237742337, -47.06001276712933],
                [-22.811788942391765, -47.06174903458464],
                [-22.81202629409612, -47.06305659402632],
                [-22.812085631957597, -47.064814296882325],
                [-22.813371279275767, -47.06406247658644],
                [-22.81459757771804, -47.06416965358985],
                [-22.817287484016216, -47.06354802697006],
                [-22.820115784072392, -47.06382657582176],
                [-22.819819111999063, -47.06228327151545],
                [-22.818414855414996, -47.06296920433732],
                [-22.817940173858293, -47.06138298468676],
                [-22.816318332722357, -47.062369013118186],
                [-22.815309616908305, -47.06078279346764],
                [-22.81329216286811, -47.062883462734575],
                [-22.811294458346055, -47.058489205594555],
                [-22.814380009445202, -47.057738966570646],
                [-22.815863422593846, -47.06076135806694],
                [-22.81641722602749, -47.06183312810111],
                [-22.818197293240235, -47.0603326500533],
                [-22.819166431162547, -47.061897434303155],
                [-22.819542217480794, -47.06136154928607],
                [-22.82092668444158, -47.06382662036463],
                [-22.82193535864896, -47.0648771999839],
                [-22.82246935961594, -47.06667777364126],
                [-22.822350692915386, -47.06804963928497],
                [-22.821361799721995, -47.06672064444263],
                [-22.821322243844875, -47.06974080879532],
                [-22.822073803545216, -47.070809661271326],
                [-22.821994692193176, -47.07219181631854],
                [-22.82096624043362, -47.0710986108837],
                [-22.82009600595428, -47.072148945517164],
                [-22.81942354822917, -47.07223468711991],
                [-22.818217071634123, -47.071527318897374],
                [-22.816377668714058, -47.07171923528889],
                [-22.8182862959901, -47.0714178256646],
                [-22.81938399178898, -47.07054815006828],
                [-22.818236850025137, -47.07011231519506],
                [-22.816812798529927, -47.07019805679778],
                [-22.81623921802656, -47.07090542502032],
                [-22.81688202359973, -47.070282016685624],
                [-22.818197293240235, -47.070292734385966],
                [-22.81911698551715, -47.07060339179582],
                [-22.818157736443844, -47.07124645381632],
                [-22.81917632028947, -47.0720181282409],
                [-22.820086116894153, -47.07199031507185],
                [-22.820986018425334, -47.0707531278005],
                [-22.821836469351187, -47.07186776863601],
                [-22.821890858473854, -47.07082663167736],
                [-22.82125302103224, -47.0699799333504],
                [-22.821045352383237, -47.06844019804172],
                [-22.821203576144548, -47.06627522257275],
                [-22.82217269267063, -47.06771139441851],
                [-22.822133137029088, -47.06618948097],
                [-22.821421133516136, -47.06486048612768],
                [-22.81942354822917, -47.063938763898285],
                [-22.817505047644467, -47.0640459409017],
                [-22.819146652906543, -47.064624696720145],
                [-22.819542217480794, -47.065589289750875],
                [-22.818474190493244, -47.06597512696319],
                [-22.8175248261389, -47.06591082076115],
                [-22.81643700467991, -47.0652034525386],
            ],
            tags=["cultural"],
        )

        add_route(
            user=User.objects.get(username="Dummy"),
            title="PB CB, círculo externo",
            description="Uma rota criada pelo Dummy.",
            starting_location="PB",
            ending_location="CB",
            coordinates=[
                [-22.817623718567944, -47.0711516458838],
                [-22.818256628413273, -47.0706155481404],
                [-22.818474190493244, -47.07001511866778],
                [-22.818454412136706, -47.06909303054912],
                [-22.817861060104644, -47.06840682543757],
            ],
            tags=["caminhada", "plana"],
            image="route_images/cover_image_unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Mummy"),
            title="Rota do PB para o IC",
            description="Uma rota criada pelo Mummy. Muita subida!",
            starting_location="PB",
            ending_location="IC",
            coordinates=[
                [-22.816812798529927, -47.071340552585085],
                [-22.817010584350285, -47.069710815445134],
                [-22.814874482289913, -47.0640925110942],
                [-22.814063545882522, -47.064482259658625],
            ],
            tags=["subida"],
            image="route_images/cover_image_unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Bunny"),
            title="Rota do PB para o IC - Bunny",
            description="Uma rota criada pelo Bunny.",
            starting_location="PB",
            ending_location="IC",
            coordinates=[
                [-22.816812798529927, -47.071340552585085],
                [-22.817110584350285, -47.069710815445134],
                [-22.814974482289913, -47.0640925110942],
                [-22.814163545882522, -47.064582259658625],
            ],
            tags=["subida"],
            image="route_images/cover_image_unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Funny"),
            title="Rota do PB para o IC - Funny",
            description="Uma rota criada pelo Funny.",
            starting_location="PB",
            ending_location="IC",
            coordinates=[
                [-22.816912798529927, -47.071440552585085],
                [-22.817210584350285, -47.069810815445134],
                [-22.814774482289913, -47.0641925110942],
                [-22.814263545882522, -47.064682259658625],
            ],
            tags=["subida"],
            image="route_images/cover_image_unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Runny"),
            title="Rota do PB para o IC - Runny",
            description="Uma rota criada pelo Runny.",
            starting_location="PB",
            ending_location="IC",
            coordinates=[
                [-22.816712798529927, -47.071240552585085],
                [-22.817310584350285, -47.069910815445134],
                [-22.814674482289913, -47.0642925110942],
                [-22.814363545882522, -47.064782259658625],
            ],
            tags=["subida"],
            image="route_images/cover_image_unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Honey"),
            title="Rota do PB para o IC - Honey",
            description="Uma rota criada pelo Honey.",
            starting_location="PB",
            ending_location="IC",
            coordinates=[
                [-22.816612798529927, -47.071140552585085],
                [-22.817410584350285, -47.070010815445134],
                [-22.814574482289913, -47.0643925110942],
                [-22.814463545882522, -47.064882259658625],
            ],
            tags=["subida"],
            image="route_images/cover_image_unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Nanny"),
            title="Rota do PB para o IC - Nanny",
            description="Uma rota criada pelo Nanny.",
            starting_location="PB",
            ending_location="IC",
            coordinates=[
                [-22.816512798529927, -47.071040552585085],
                [-22.817510584350285, -47.070110815445134],
                [-22.814474482289913, -47.0644925110942],
                [-22.814563545882522, -47.064982259658625],
            ],
            tags=["subida"],
            image="route_images/cover_image_unicamp.jpg",
        )
