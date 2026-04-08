import { FormEvent, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Property, formatPrice, properties as catalogProperties } from "@/data/properties";
import { CalendarDays, Camera, Home, Plus, Sparkles, Trash2, Users } from "lucide-react";

interface Reservation {
  id: string;
  propertyId: string;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  status: "confirmada" | "pendente" | "cancelada";
  total: number;
}

interface PropertyPhoto {
  id: string;
  propertyId: string;
  url: string;
  caption: string;
  published: boolean;
  cover: boolean;
}

const STORAGE_KEYS = {
  properties: "admin.properties.v1",
  reservations: "admin.reservations.v1",
  photos: "admin.photos.v1",
};

const today = new Date().toISOString().split("T")[0];

const initialReservations: Reservation[] = [
  {
    id: "R-1001",
    propertyId: "3",
    guestName: "Ana Ferreira",
    email: "ana@email.com",
    checkIn: "2026-05-12",
    checkOut: "2026-05-18",
    status: "confirmada",
    total: 21000,
  },
  {
    id: "R-1002",
    propertyId: "2",
    guestName: "Lucas Nascimento",
    email: "lucas@email.com",
    checkIn: "2026-06-03",
    checkOut: "2026-06-10",
    status: "pendente",
    total: 33000,
  },
];

const initialPhotos: PropertyPhoto[] = catalogProperties.flatMap((property, index) =>
  property.images.map((image, imageIndex) => ({
    id: `PH-${index + 1}${imageIndex + 1}`,
    propertyId: property.id,
    url: image,
    caption: `${property.title} • Foto ${imageIndex + 1}`,
    published: true,
    cover: imageIndex === 0,
  })),
);

const statusColor: Record<Reservation["status"], string> = {
  confirmada: "bg-emerald-100 text-emerald-700",
  pendente: "bg-amber-100 text-amber-700",
  cancelada: "bg-rose-100 text-rose-700",
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function AdminPanel() {
  const [managedProperties, setManagedProperties] = useState<Property[]>(() => readStorage(STORAGE_KEYS.properties, catalogProperties));
  const [reservations, setReservations] = useState<Reservation[]>(() => readStorage(STORAGE_KEYS.reservations, initialReservations));
  const [photos, setPhotos] = useState<PropertyPhoto[]>(() => readStorage(STORAGE_KEYS.photos, initialPhotos));
  const [propertySearch, setPropertySearch] = useState("");
  const [reservationFilter, setReservationFilter] = useState<Reservation["status"] | "todas">("todas");

  const [propertyForm, setPropertyForm] = useState({
    title: "",
    type: "casa" as Property["type"],
    listing: "venda" as Property["listing"],
    price: "",
    city: "",
    state: "",
    location: "",
    description: "",
    bedrooms: "0",
    bathrooms: "0",
    area: "0",
  });

  const [reservationForm, setReservationForm] = useState({
    propertyId: catalogProperties[0]?.id ?? "",
    guestName: "",
    email: "",
    checkIn: today,
    checkOut: today,
    total: "",
  });

  const [photoForm, setPhotoForm] = useState({
    propertyId: catalogProperties[0]?.id ?? "",
    url: "",
    caption: "",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.properties, JSON.stringify(managedProperties));
  }, [managedProperties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reservations, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.photos, JSON.stringify(photos));
  }, [photos]);

  const dashboardMetrics = useMemo(() => {
    const confirmed = reservations.filter((reservation) => reservation.status === "confirmada");
    const pending = reservations.filter((reservation) => reservation.status === "pendente");

    return {
      totalProperties: managedProperties.length,
      totalPhotos: photos.length,
      confirmedBookings: confirmed.length,
      pendingBookings: pending.length,
      monthlyRevenue: confirmed.reduce((sum, reservation) => sum + reservation.total, 0),
      featuredProperties: managedProperties.filter((property) => property.featured).length,
      totalGuests: new Set(reservations.map((reservation) => reservation.email)).size,
    };
  }, [managedProperties, photos, reservations]);

  const propertyNameById = useMemo(
    () => Object.fromEntries(managedProperties.map((property) => [property.id, property.title])),
    [managedProperties],
  );

  const filteredProperties = useMemo(() => {
    const normalizedSearch = propertySearch.toLowerCase().trim();
    if (!normalizedSearch) return managedProperties;

    return managedProperties.filter((property) => {
      const fields = `${property.title} ${property.city} ${property.state} ${property.location}`.toLowerCase();
      return fields.includes(normalizedSearch);
    });
  }, [managedProperties, propertySearch]);

  const filteredReservations = useMemo(() => {
    if (reservationFilter === "todas") return reservations;
    return reservations.filter((reservation) => reservation.status === reservationFilter);
  }, [reservations, reservationFilter]);

  const addProperty = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = `${Date.now()}`;
    const newProperty: Property = {
      id,
      title: propertyForm.title,
      type: propertyForm.type,
      listing: propertyForm.listing,
      price: Number(propertyForm.price),
      location: propertyForm.location,
      city: propertyForm.city,
      state: propertyForm.state,
      description: propertyForm.description,
      bedrooms: Number(propertyForm.bedrooms),
      bathrooms: Number(propertyForm.bathrooms),
      area: Number(propertyForm.area),
      oceanView: true,
      featured: false,
      status: "disponivel",
      images: ["/placeholder.svg"],
      amenities: ["Cadastro inicial"],
      lat: -14.235,
      lng: -51.9253,
    };

    setManagedProperties((prev) => [newProperty, ...prev]);
    setPropertyForm({
      title: "",
      type: "casa",
      listing: "venda",
      price: "",
      city: "",
      state: "",
      location: "",
      description: "",
      bedrooms: "0",
      bathrooms: "0",
      area: "0",
    });
  };

  const removeProperty = (id: string) => {
    setManagedProperties((prev) => prev.filter((property) => property.id !== id));
    setReservations((prev) => prev.filter((reservation) => reservation.propertyId !== id));
    setPhotos((prev) => prev.filter((photo) => photo.propertyId !== id));
  };

  const togglePropertyFeatured = (id: string) => {
    setManagedProperties((prev) =>
      prev.map((property) => (property.id === id ? { ...property, featured: !property.featured } : property)),
    );
  };

  const changePropertyStatus = (id: string, status: Property["status"]) => {
    setManagedProperties((prev) =>
      prev.map((property) => (property.id === id ? { ...property, status } : property)),
    );
  };

  const addPhoto = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newPhoto: PropertyPhoto = {
      id: `PH-${Date.now()}`,
      propertyId: photoForm.propertyId,
      url: photoForm.url,
      caption: photoForm.caption,
      published: true,
      cover: false,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setPhotoForm({
      propertyId: managedProperties[0]?.id ?? "",
      url: "",
      caption: "",
    });
  };

  const togglePhotoPublication = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === photoId ? { ...photo, published: !photo.published } : photo)),
    );
  };

  const makePhotoCover = (photoId: string) => {
    setPhotos((prev) => {
      const selected = prev.find((photo) => photo.id === photoId);
      if (!selected) return prev;

      return prev.map((photo) => {
        if (photo.propertyId !== selected.propertyId) return photo;
        return { ...photo, cover: photo.id === photoId };
      });
    });
  };

  const addReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newReservation: Reservation = {
      id: `R-${1000 + reservations.length + 1}`,
      propertyId: reservationForm.propertyId,
      guestName: reservationForm.guestName,
      email: reservationForm.email,
      checkIn: reservationForm.checkIn,
      checkOut: reservationForm.checkOut,
      status: "pendente",
      total: Number(reservationForm.total),
    };

    setReservations((prev) => [newReservation, ...prev]);
    setReservationForm({
      propertyId: managedProperties[0]?.id ?? "",
      guestName: "",
      email: "",
      checkIn: today,
      checkOut: today,
      total: "",
    });
  };

  const toggleReservationStatus = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((reservation) => {
        if (reservation.id !== reservationId) return reservation;
        if (reservation.status === "pendente") return { ...reservation, status: "confirmada" };
        if (reservation.status === "confirmada") return { ...reservation, status: "cancelada" };
        return { ...reservation, status: "pendente" };
      }),
    );
  };

  return (
    <section className="mobile-shell py-28 md:py-32">
      <div className="space-y-3">
        <Badge className="w-fit bg-primary/10 text-primary">Painel Administrativo</Badge>
        <h1 className="font-serif text-3xl font-bold text-primary md:text-4xl">Gestão completa de operação imobiliária</h1>
        <p className="max-w-3xl text-muted-foreground">
          Gestão centralizada de catálogo, mídia, reservas e indicadores com persistência local para testes de fluxo.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Imóveis cadastrados</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl"><Home className="h-6 w-6 text-primary" />{dashboardMetrics.totalProperties}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Fotos no sistema</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl"><Camera className="h-6 w-6 text-primary" />{dashboardMetrics.totalPhotos}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reservas confirmadas</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl"><CalendarDays className="h-6 w-6 text-primary" />{dashboardMetrics.confirmedBookings}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hóspedes únicos</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl"><Users className="h-6 w-6 text-primary" />{dashboardMetrics.totalGuests}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="mt-8 space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="properties">Propriedades</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          <TabsTrigger value="crm">CRM & receita</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Novo imóvel</CardTitle>
              <CardDescription>Cadastro rápido para alimentar o catálogo comercial.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addProperty} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="space-y-1.5 xl:col-span-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" value={propertyForm.title} onChange={(e) => setPropertyForm((prev) => ({ ...prev, title: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="price">Preço</Label>
                  <Input id="price" type="number" min={0} value={propertyForm.price} onChange={(e) => setPropertyForm((prev) => ({ ...prev, price: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={propertyForm.city} onChange={(e) => setPropertyForm((prev) => ({ ...prev, city: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="state">UF</Label>
                  <Input id="state" value={propertyForm.state} onChange={(e) => setPropertyForm((prev) => ({ ...prev, state: e.target.value.toUpperCase() }))} maxLength={2} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">Região</Label>
                  <Input id="location" value={propertyForm.location} onChange={(e) => setPropertyForm((prev) => ({ ...prev, location: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="type">Tipo</Label>
                  <select id="type" value={propertyForm.type} onChange={(e) => setPropertyForm((prev) => ({ ...prev, type: e.target.value as Property["type"] }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="casa">Casa</option>
                    <option value="villa">Villa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="terreno">Terreno</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="listing">Operação</Label>
                  <select id="listing" value={propertyForm.listing} onChange={(e) => setPropertyForm((prev) => ({ ...prev, listing: e.target.value as Property["listing"] }))} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bedrooms">Quartos</Label>
                  <Input id="bedrooms" type="number" min={0} value={propertyForm.bedrooms} onChange={(e) => setPropertyForm((prev) => ({ ...prev, bedrooms: e.target.value }))} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bathrooms">Banheiros</Label>
                  <Input id="bathrooms" type="number" min={0} value={propertyForm.bathrooms} onChange={(e) => setPropertyForm((prev) => ({ ...prev, bathrooms: e.target.value }))} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="area">Área (m²)</Label>
                  <Input id="area" type="number" min={0} value={propertyForm.area} onChange={(e) => setPropertyForm((prev) => ({ ...prev, area: e.target.value }))} />
                </div>

                <div className="space-y-1.5 md:col-span-2 xl:col-span-3">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea id="description" value={propertyForm.description} onChange={(e) => setPropertyForm((prev) => ({ ...prev, description: e.target.value }))} rows={3} required />
                </div>

                <div className="md:col-span-2 xl:col-span-3">
                  <Button type="submit" className="gap-2"><Plus className="h-4 w-4" />Cadastrar imóvel</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catálogo de imóveis</CardTitle>
              <CardDescription>Busque por título, cidade ou localização para editar rapidamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Buscar imóvel..." value={propertySearch} onChange={(e) => setPropertySearch(e.target.value)} />

              {filteredProperties.map((property) => (
                <div key={property.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{property.title}</p>
                      <p className="text-sm text-muted-foreground">{property.city}/{property.state} • {property.listing} • {formatPrice(property.price, property.priceLabel)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant={property.featured ? "secondary" : "outline"} size="sm" onClick={() => togglePropertyFeatured(property.id)}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {property.featured ? "Destaque" : "Destacar"}
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-2" onClick={() => removeProperty(property.id)}>
                        <Trash2 className="h-4 w-4" />Excluir
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Label>Status:</Label>
                    <select className="h-8 rounded-md border border-input bg-background px-2" value={property.status} onChange={(e) => changePropertyStatus(property.id, e.target.value as Property["status"])}>
                      <option value="disponivel">Disponível</option>
                      <option value="vendido">Vendido</option>
                      <option value="alugado">Alugado</option>
                    </select>
                    <Badge className="bg-muted text-foreground">{property.type}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar nova foto</CardTitle>
              <CardDescription>Registre URL da foto e associe ao imóvel correto.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addPhoto} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="photo-property">Imóvel</Label>
                  <select id="photo-property" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={photoForm.propertyId} onChange={(e) => setPhotoForm((prev) => ({ ...prev, propertyId: e.target.value }))} required>
                    {managedProperties.map((property) => (
                      <option key={property.id} value={property.id}>{property.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 xl:col-span-2">
                  <Label htmlFor="photo-url">URL da imagem</Label>
                  <Input id="photo-url" type="url" value={photoForm.url} onChange={(e) => setPhotoForm((prev) => ({ ...prev, url: e.target.value }))} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="photo-caption">Legenda</Label>
                  <Input id="photo-caption" value={photoForm.caption} onChange={(e) => setPhotoForm((prev) => ({ ...prev, caption: e.target.value }))} required />
                </div>
                <div>
                  <Button type="submit">Adicionar foto</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Biblioteca de fotos ({photos.length})</CardTitle>
              <CardDescription>Controle publicação e escolha a capa principal de cada imóvel.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{photo.caption}</p>
                    <p className="text-sm text-muted-foreground">{propertyNameById[photo.propertyId] ?? "Imóvel removido"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant={photo.cover ? "secondary" : "outline"} onClick={() => makePhotoCover(photo.id)}>
                      {photo.cover ? "Capa" : "Definir capa"}
                    </Button>
                    <Button size="sm" variant={photo.published ? "secondary" : "outline"} onClick={() => togglePhotoPublication(photo.id)}>
                      {photo.published ? "Publicado" : "Oculto"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Nova reserva</CardTitle>
              <CardDescription>Crie reservas manuais e acompanhe o status de aprovação.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addReservation} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="property">Imóvel</Label>
                  <select id="property" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={reservationForm.propertyId} onChange={(e) => setReservationForm((prev) => ({ ...prev, propertyId: e.target.value }))} required>
                    {managedProperties.map((property) => (
                      <option key={property.id} value={property.id}>{property.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guestName">Hóspede</Label>
                  <Input id="guestName" value={reservationForm.guestName} onChange={(e) => setReservationForm((prev) => ({ ...prev, guestName: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guestEmail">E-mail</Label>
                  <Input id="guestEmail" type="email" value={reservationForm.email} onChange={(e) => setReservationForm((prev) => ({ ...prev, email: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="checkIn">Check-in</Label>
                  <Input id="checkIn" type="date" value={reservationForm.checkIn} onChange={(e) => setReservationForm((prev) => ({ ...prev, checkIn: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="checkOut">Check-out</Label>
                  <Input id="checkOut" type="date" value={reservationForm.checkOut} onChange={(e) => setReservationForm((prev) => ({ ...prev, checkOut: e.target.value }))} required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="total">Valor total</Label>
                  <Input id="total" type="number" min={0} value={reservationForm.total} onChange={(e) => setReservationForm((prev) => ({ ...prev, total: e.target.value }))} required />
                </div>

                <div className="self-end">
                  <Button type="submit">Criar reserva</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reservas ({filteredReservations.length})</CardTitle>
              <CardDescription>Filtre por status para priorizar atendimento e aprovação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(["todas", "pendente", "confirmada", "cancelada"] as const).map((status) => (
                  <Button key={status} size="sm" variant={reservationFilter === status ? "secondary" : "outline"} onClick={() => setReservationFilter(status)}>
                    {status}
                  </Button>
                ))}
              </div>

              {filteredReservations.map((reservation) => (
                <Dialog key={reservation.id}>
                  <DialogTrigger asChild>
                    <button className="w-full rounded-lg border p-4 text-left transition hover:border-primary/50">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold">{reservation.id} • {reservation.guestName}</p>
                        <Badge className={statusColor[reservation.status]}>{reservation.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {propertyNameById[reservation.propertyId]} • {reservation.checkIn} a {reservation.checkOut} • {formatPrice(reservation.total)}
                      </p>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reserva {reservation.id}</DialogTitle>
                      <DialogDescription>Atualize o status em 1 clique para manter comercial e operação alinhados.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                      <p><strong>Imóvel:</strong> {propertyNameById[reservation.propertyId]}</p>
                      <p><strong>Hóspede:</strong> {reservation.guestName}</p>
                      <p><strong>E-mail:</strong> {reservation.email}</p>
                      <p><strong>Período:</strong> {reservation.checkIn} até {reservation.checkOut}</p>
                      <p><strong>Total:</strong> {formatPrice(reservation.total)}</p>
                    </div>
                    <Button onClick={() => toggleReservationStatus(reservation.id)}>Alterar status (atual: {reservation.status})</Button>
                  </DialogContent>
                </Dialog>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />KPI comercial</CardTitle>
              <CardDescription>Resumo executivo para comercial, marketing e atendimento.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Imóveis destaque</p>
                <p className="text-2xl font-bold text-primary">{dashboardMetrics.featuredProperties}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Reservas pendentes</p>
                <p className="text-2xl font-bold text-primary">{dashboardMetrics.pendingBookings}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Receita confirmada</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(dashboardMetrics.monthlyRevenue)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Taxa de aprovação</p>
                <p className="text-2xl font-bold text-primary">{reservations.length ? Math.round((dashboardMetrics.confirmedBookings / reservations.length) * 100) : 0}%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default AdminPanel;
