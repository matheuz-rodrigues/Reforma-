'use client';

import { useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Camera, X } from 'lucide-react';
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
}

interface FormErrors {
    title?: string;
    description?: string;
    price?: string;
    category?: string;
}

export function CreateAdvertisementForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    function validate(): boolean {
        const newErrors: FormErrors = {};
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

                    <div className="space-y-2">
                        <Label htmlFor="location">Localização (Opcional)</Label>
                        <Input id="location" name="location" placeholder="Ex: São Paulo, SP" value={formData.location} onChange={handleChange} className="h-12" />
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
