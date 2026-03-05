'use client';

import { useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Camera, X, MapPin, Loader2, Search } from 'lucide-react';
import { marketplaceService } from '../services/marketplace.service';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card';

interface FormData {
    title: string;
    description: string;
    price: string;
    originalPrice: string;
    category: string;
    condition: 'novo' | 'usado' | 'sobra';
    location: string;
    latitude?: string;
    longitude?: string;
}

interface FormErrors {
    title?: string;
    description?: string;
    price?: string;
    category?: string;
    photos?: string;
}

export function CreateAdvertisementForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        condition: 'sobra',
        location: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function validate(): boolean {
        const newErrors: FormErrors = {};
        if (selectedFiles.length === 0) newErrors.photos = 'Adicione pelo menos uma foto do produto';
        if (!formData.title || formData.title.length < 5) newErrors.title = 'O título deve ter no mínimo 5 caracteres';
        if (!formData.description || formData.description.length < 10) newErrors.description = 'A descrição deve ter no mínimo 10 caracteres';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Informe um preço válido';
        if (!formData.category) newErrors.category = 'Selecione uma categoria';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newFiles = [...selectedFiles, ...files].slice(0, 10);
            setSelectedFiles(newFiles);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews].slice(0, 10));
        }
    }

    function removeImage(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const newPreviews = prev.filter((_, i) => i !== index);
            URL.revokeObjectURL(prev[index]);
            return newPreviews;
        });
    }

    async function handleSearchLocation() {
        if (!formData.location || formData.location.trim().length < 3) {
            alert('Digite o nome da cidade ou bairro no campo ao lado para buscar no mapa.');
            return;
        }

        setIsGettingLocation(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.location)}&format=json&limit=5`);
            const data = await response.json();

            if (data && data.length > 0) {
                setLocationSuggestions(data);
            } else {
                alert('Localização não encontrada. Tente digitar de outra forma (ex: Nome do Bairro, Cidade).');
                setLocationSuggestions([]);
            }
        } catch (error) {
            console.error('Erro ao buscar localização:', error);
            alert('Erro ao buscar a localização. Tente novamente mais tarde.');
            setLocationSuggestions([]);
        } finally {
            setIsGettingLocation(false);
        }
    }

    const handleSelectLocation = (result: any) => {
        setFormData(prev => ({
            ...prev,
            latitude: result.lat,
            longitude: result.lon,
            location: result.display_name.split(',').slice(0, 3).join(', ')
        }));
        setLocationSuggestions([]);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            if (formData.originalPrice) data.append('originalPrice', formData.originalPrice);
            data.append('category', formData.category);
            data.append('condition', formData.condition);
            if (formData.location) data.append('location', formData.location);
            if (formData.latitude) data.append('latitude', formData.latitude);
            if (formData.longitude) data.append('longitude', formData.longitude);

            selectedFiles.forEach(file => {
                data.append('files', file);
            });

            await marketplaceService.createAdvertisement(data);

            // Success cleanup
            previews.forEach(p => URL.revokeObjectURL(p));
            router.push('/marketplace');

        } catch (error) {
            console.error('Error creating advertisement:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="max-w-4xl mx-auto shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Anunciar Material</CardTitle>
                <CardDescription>
                    Preencha os dados abaixo para anunciar seu material ou sobra de obra.
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base">Fotos do produto (Máx. 10)</Label>
                        <div className="grid grid-cols-5 gap-3">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group border">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 10 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                                >
                                    <Camera className="h-8 w-8 mb-2" />
                                    <span className="text-xs uppercase font-bold">Adicionar</span>
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        {errors.photos && <p className="text-sm text-red-500 mt-1">{errors.photos}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Título do anúncio</Label>
                        <Input id="title" name="title" placeholder="Ex: Porcelanato Portobello 60x60" value={formData.title} onChange={handleChange} className="h-12" />
                        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Detalhes sobre o material, quantidade, motivos da venda..."
                            className="resize-none min-h-[120px]"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Preço de venda (R$)</Label>
                            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="h-12" />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice">Preço original (R$) - Opcional</Label>
                            <Input id="originalPrice" name="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={handleChange} className="h-12" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select value={formData.category} onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}>
                                <SelectTrigger id="category" className="h-12">
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="revestimentos">Revestimentos</SelectItem>
                                    <SelectItem value="tintas">Tintas</SelectItem>
                                    <SelectItem value="pisos">Pisos</SelectItem>
                                    <SelectItem value="cimento">Cimento/Argamassa</SelectItem>
                                    <SelectItem value="esquadrias">Esquadrias</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="condition">Condição</Label>
                            <Select value={formData.condition} onValueChange={(v) => setFormData(p => ({ ...p, condition: v as 'novo' | 'usado' | 'sobra' }))}>
                                <SelectTrigger id="condition" className="h-12">
                                    <SelectValue placeholder="Selecione a condição" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="novo">Novo</SelectItem>
                                    <SelectItem value="usado">Usado</SelectItem>
                                    <SelectItem value="sobra">Sobra de Obra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            Localização do Material
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder="Ex: São Paulo, SP"
                                    value={formData.location}
                                    onChange={(e) => {
                                        handleChange(e);
                                        if (locationSuggestions.length > 0) setLocationSuggestions([]);
                                    }}
                                    className="h-12 w-full"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSearchLocation();
                                        }
                                    }}
                                />
                                {locationSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                        {locationSuggestions.map((item: any, index: number) => (
                                            <button
                                                type="button"
                                                key={index}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors border-b last:border-b-0"
                                                onClick={() => handleSelectLocation(item)}
                                            >
                                                {item.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                className="h-12 px-4 flex items-center gap-2 whitespace-nowrap"
                                onClick={handleSearchLocation}
                                disabled={isGettingLocation || !formData.location}
                            >
                                {isGettingLocation ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Buscando...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-4 w-4" />
                                        Buscar no Mapa
                                    </>
                                )}
                            </Button>
                        </div>
                        {formData.latitude && formData.longitude && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                Localização aproximada encontrada! O comprador verá uma estimativa de distância.
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-4 pt-4 border-t bg-gray-50/50 rounded-b-xl">
                    <Button type="button" variant="outline" size="lg" onClick={() => router.push('/marketplace')}>
                        Cancelar
                    </Button>
                    <Button type="submit" size="lg" disabled={isLoading} className="px-8 font-bold">
                        {isLoading ? 'Publicando...' : 'Publicar Anúncio'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
