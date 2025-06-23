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

        add_user("Luan Cardoso", "l@email.com", "123")
        add_user("José Rocha", "j@email.com", "123")
        add_user("Sara Pereira", "s@email.com", "123")
        add_user("Isabella Ferreira", "i@email.com", "123")
        add_user("Gabriela Dias", "g@email.com", "123")
        add_user("Clara Carvalha", "c@email.com", "123")
        add_user("Dummy", "dummy@email.com", "123")

        add_route(
            user=User.objects.get(username="Luan Cardoso"),
            title="PB para IC - Rota mais rápida",
            description="Rota ideal para economizar tempo. O percurso é todo pavimentado, passando por áreas de grande movimento estudantil, como a Praça do Ciclo Básico. É um caminho direto, mas possui várias subidas.",
            starting_location="PB",
            ending_location="IC",
            coordinates=[
                [-22.81755943849723, -47.070700732261535],
                [-22.81731220717329, -47.070057414969455],
                [-22.817411099756733, -47.069848336849525],
                [-22.81739626587379, -47.069623175797304],
                [-22.81729242864798, -47.06946234647428],
                [-22.81700069506608, -47.069424819632225],
                [-22.814854703410585, -47.064032267851346],
                [-22.81380641869644, -47.06461125341421],
            ],
            tags=["caminhada", "subida"],
            image="route_images/Praça_CB_Unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="José Rocha"),
            title="IC até o Observatório",
            description="Saindo do IC, siga em direção à Av. Alan Turing. É uma caminhada de médio porte com uma subida íngreme no trecho final até o Observatório. Prepare-se para o esforço, mas a vista compensa!",
            starting_location="IC",
            ending_location="Observatório",
            coordinates=[
                [-22.814755808970894, -47.063923740876305],
                [-22.813747081584573, -47.0646313898976],
                [-22.812995475930155, -47.06409529215419],
                [-22.813035034225884, -47.06306598448684],
                [-22.813272383759028, -47.06184368163187],
                [-22.813984429876975, -47.05888442208827],
                [-22.814380009445202, -47.05828399261565],
                [-22.814439346281365, -47.05716890930935],
            ],
            tags=["caminhada", "cultural", "lazer", "subida"],
            image="route_images/obser.jpg",
        )

        add_route(
            user=User.objects.get(username="Sarah Pereira"),
            title="Corrida: Círculo Interno",
            description="Circuito clássico de 1km ao redor do Ciclo Básico (DCE). Quase todo plano e em asfalto, é perfeito para treinos de velocidade ou para iniciantes. Rota movimentada e arborizada.",
            starting_location="PB",
            ending_location="PB ",
            coordinates=[
                [-22.817623718567944, -47.071215977613015],
                [-22.818335741937112, -47.07057266032092],
                [-22.818474190493244, -47.06935035746595],
                [-22.81774238938799, -47.06840682543757],
                [-22.816634791046013, -47.06832104979861],
                [-22.815823865119555, -47.068942923180956],
                [-22.81572497138358, -47.07031533340409],
                [-22.81641722602749, -47.0711516458838],
                [-22.816911691476015, -47.07128030934222],
            ],
            tags=["corrida"],
            image="route_images/unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Isabella Ferreira"),
            title="Rota da Saúde: CB ao HC",
            description="Conecta a área da saúde ao coração da universidade. É um trajeto essencial para todos os alunos que eventualmente precisem dos serviços oferecidos pelo hospital.",
            starting_location="CB",
            ending_location="HC ",
            coordinates=[
                [-22.81764349704514, -47.06829670096745],
                [-22.81831596356046, -47.06610942217435],
                [-22.81942354822917, -47.067310281119575],
                [-22.82163869054012, -47.06456546067334],
                [-22.822706692706763, -47.06533744142385],
                [-22.82409112749098, -47.06413658247861],
                [-22.825040446063493, -47.06516589014594],
                [-22.825040446063493, -47.0640079190202],
                [-22.8259897580161, -47.06357904082546],
            ],
            tags=["sombra", "tranquila", "passeio", "longa"],
            image="route_images/Hospital_de_Clínicas_da_Unicamp_(1).jpg",
        )

        add_route(
            user=User.objects.get(username="Gabriela Dias"),
            title="Volta do Anel Externo Corrida",
            description="O circuito mais longo da Unicamp, contornando todo o perímetro do campus pelas avenidas principais É o favorito para treinos de longa distância de corredores e ciclistas.",
            starting_location="Av1",
            ending_location="Av2 ",
            coordinates=[
                [-22.82163869054012, -47.06992263968977],
                [-22.821361799721995, -47.068250014730324],
                [-22.81950266107508, -47.06494765263093],
                [-22.81657545516633, -47.063446578949396],
                [-22.813766860624725, -47.06447588661673],
                [-22.81261967154773, -47.0668776045072],
                [-22.81321304641451, -47.07078039607921],
                [-22.814795366755394, -47.072624572316535],
                [-22.817722610925173, -47.0728390114139],
                [-22.818671973900695, -47.07288189923337],
            ],
            tags=["corrida", "ciclovia"],
            image="route_images/cover_image_unicamp.jpg",
        )

        add_route(
            user=User.objects.get(username="Clara Carvalho"),
            title="Tour dos Bandejões: RU RA RS",
            description="Uma rota utilitária que interliga os três principais restaurantes universitários (RU, RA e RS). Ideal para calouros ou para quem precisa decidir onde almoçar.",
            starting_location="RU",
            ending_location="RS",
            coordinates=[
                [-22.817089698597993, -47.07237071352017],
                [-22.817089698597993, -47.071255630213884],
                [-22.81827640679855, -47.07052653728283],
                [-22.818474190493244, -47.06893968796235],
                [-22.821322243844875, -47.06782460465607],
                [-22.820887128438063, -47.06709551172503],
                [-22.822667137220368, -47.066109091877166],
                [-22.821796913611948, -47.064693793834564],
                [-22.820491567770727, -47.066109091877166],
                [-22.818157736443844, -47.06387892526458],
                [-22.81807862281659, -47.06274563326717],
                [-22.815902980056652, -47.062574081989275],
            ],
            tags=["caminhada", "cultural", "histórica", "lazer"],
            image="route_images/Bandejao.jpg",
        )
