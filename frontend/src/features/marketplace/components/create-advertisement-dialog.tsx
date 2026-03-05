'use client';

import { useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Package, Camera, X, Image as ImageIcon } from 'lucide-react';
import { marketplaceService } from '../services/marketplace.service';

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

interface CreateAdvertisementDialogProps {
    onSuccess?: () => void;
}

export function CreateAdvertisementDialog({ onSuccess }: CreateAdvertisementDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        condition: 'novo',
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
            const newFiles = [...selectedFiles, ...files].slice(0, 5);
            setSelectedFiles(newFiles);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
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
            setOpen(false);
            setFormData({ title: '', description: '', price: '', originalPrice: '', category: '', condition: 'novo', location: '' });
            setSelectedFiles([]);
            previews.forEach(p => URL.revokeObjectURL(p));
            setPreviews([]);

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error creating advertisement:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full h-full min-h-[56px] text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Package className="mr-3 h-6 w-6" />
                    Anunciar Material
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Anunciar Material</DialogTitle>
                    <DialogDescription>
                        Preencha os dados abaixo para anunciar seu material ou sobra de obra.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Fotos do produto (Máx. 5)</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 5 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                                >
                                    <Camera className="h-6 w-6 mb-1" />
                                    <span className="text-[10px] uppercase font-bold text-slate-500 pt-1">Adicionar</span>
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

                    <div>
                        <Label htmlFor="title">Título do anúncio</Label>
                        <Input id="title" name="title" placeholder="Ex: Porcelanato Portobello 60x60" value={formData.title} onChange={handleChange} />
                        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Detalhes sobre o material, quantidade, motivos da venda..."
                            className="resize-none"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="price">Preço de venda (R$)</Label>
                            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
                            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <Label htmlFor="originalPrice">Preço original (R$) - Opcional</Label>
                            <Input id="originalPrice" name="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category">Categoria</Label>
                            <Select value={formData.category} onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Selecione" />
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

                        <div>
                            <Label htmlFor="condition">Condição</Label>
                            <Select value={formData.condition} onValueChange={(v) => setFormData(p => ({ ...p, condition: v as 'novo' | 'usado' | 'sobra' }))}>
                                <SelectTrigger id="condition">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="novo">Novo</SelectItem>
                                    <SelectItem value="usado">Usado</SelectItem>
                                    <SelectItem value="sobra">Sobra de Obra</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="location">Localização (Opcional)</Label>
                        <Input id="location" name="location" placeholder="Ex: São Paulo, SP" value={formData.location} onChange={handleChange} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Publicando...' : 'Publicar Anúncio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
