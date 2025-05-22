import React from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import Header from "../components/Header";

export default function ComponentsPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Biblioteca de Componentes</h1>

        <Tabs defaultValue="buttons">
          <TabsList className="mb-4">
            <TabsTrigger value="buttons">Botões</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="forms">Formulários</TabsTrigger>
          </TabsList>

          {/* Botões */}
          <TabsContent value="buttons">
            <h2 className="text-2xl font-bold mb-4">Botões</h2>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center gap-4">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center gap-4">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Cards */}
          <TabsContent value="cards">
            <h2 className="text-2xl font-bold mb-4">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Básico</CardTitle>
                  <CardDescription>Uma descrição para o card</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Conteúdo do card vai aqui. Você pode adicionar qualquer
                    elemento React.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button>Ação</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exemplo de Perfil</CardTitle>
                  <CardDescription>Informações do usuário</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-12 w-12 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">João Silva</p>
                        <p className="text-sm text-gray-500">
                          joao@exemplo.com
                        </p>
                      </div>
                    </div>
                    <p className="mt-4">
                      Desenvolvedor Frontend com 5 anos de experiência em React.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost">Cancelar</Button>
                  <Button>Salvar</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Forms */}
          <TabsContent value="forms">
            <h2 className="text-2xl font-bold mb-4">Formulários</h2>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Exemplo de Formulário</CardTitle>
                <CardDescription>Preencha os campos abaixo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Digite seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Enviar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
