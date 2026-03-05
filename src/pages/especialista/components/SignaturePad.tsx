import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { RotateCcw, Check, MousePointer2 } from 'lucide-react';

interface SignaturePadProps {
    onSave: (signatureBase64: string) => void;
    onCancel: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set line style
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.beginPath();
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        if (!hasSignature) setHasSignature(true);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleSave = () => {
        if (!canvasRef.current || !hasSignature) return;
        const base64 = canvasRef.current.toDataURL('image/png');
        onSave(base64);
    };

    return (
        <div className="space-y-4">
            <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-black/20 overflow-hidden cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="w-full h-64 block"
                    style={{ touchAction: 'none' }}
                />
                {!hasSignature && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <MousePointer2 className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm font-normal">Assine aqui</p>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between gap-3">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white font-normal"
                >
                    Cancelar
                </Button>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={clear}
                        disabled={!hasSignature}
                        className="flex items-center gap-2 border-gray-200 dark:border-gray-800 font-normal"
                    >
                        <RotateCcw className="h-4 w-4" /> Limpar
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasSignature}
                        className="flex items-center gap-2 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal px-6"
                    >
                        <Check className="h-4 w-4" /> Confirmar Assinatura
                    </Button>
                </div>
            </div>
        </div>
    );
}
