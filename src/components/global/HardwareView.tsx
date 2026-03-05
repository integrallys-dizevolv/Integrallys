import React, { useState, useEffect, useRef } from 'react';
import { Camera, Printer, Check, AlertCircle, RefreshCw, Play, Settings2, Loader2, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

export function HardwareView() {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>('');
    const [cameraStatus, setCameraStatus] = useState<'undetected' | 'connected' | 'error'>('undetected');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isSecure = typeof window !== 'undefined' && window.isSecureContext;
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [printerProfile, setPrinterProfile] = useState('thermal_60x40');
    const [marginTop, setMarginTop] = useState('0');
    const [marginLeft, setMarginLeft] = useState('0');

    // Load saved preferences
    useEffect(() => {
        const savedCamera = localStorage.getItem('pref_webcam_id');
        const savedPrinter = localStorage.getItem('pref_printer_profile');
        const savedMT = localStorage.getItem('pref_print_margin_top');
        const savedML = localStorage.getItem('pref_print_margin_left');

        if (savedCamera) setSelectedCamera(savedCamera);
        if (savedPrinter) setPrinterProfile(savedPrinter);
        if (savedMT) setMarginTop(savedMT);
        if (savedML) setMarginLeft(savedML);

        detectCameras();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const detectCameras = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setCameras(videoDevices);

            if (videoDevices.length > 0) {
                setCameraStatus('connected');
                if (!selectedCamera) {
                    setSelectedCamera(videoDevices[0].deviceId);
                }
            } else {
                setCameraStatus('undetected');
            }
        } catch (error) {
            console.error('Error detecting cameras:', error);
            setCameraStatus('error');
        }
    };

    const startCamera = async () => {
        if (isStreaming) {
            stopCamera();
            return;
        }

        if (!isSecure) {
            toast.error('O acesso à câmera requer uma conexão segura (HTTPS).');
            return;
        }

        setIsLoading(true);

        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            if (!selectedCamera || selectedCamera === 'none') {
                toast.error('Nenhuma câmera selecionada ou disponível.');
                setIsLoading(false);
                return;
            }

            const constraints = {
                video: { deviceId: { exact: selectedCamera } }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Critically important for mobile and some production environments
                videoRef.current.setAttribute('playsinline', 'true');

                await videoRef.current.play();
                setIsStreaming(true);
                toast.success('câmera iniciada com sucesso!');
            }
        } catch (error: any) {
            console.error('Error starting camera:', error);
            setIsStreaming(false);

            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                toast.error('Acesso à câmera negado. Clique no ícone de cadeado 🔒 na barra de endereços para permitir.', {
                    duration: 6000,
                });
            } else if (error.name === 'NotFoundError') {
                toast.error('Dispositivo de câmera não encontrado.');
            } else {
                toast.error(`Erro ao acessar a webcam: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsStreaming(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem('pref_webcam_id', selectedCamera);
        localStorage.setItem('pref_printer_profile', printerProfile);
        localStorage.setItem('pref_print_margin_top', marginTop);
        localStorage.setItem('pref_print_margin_left', marginLeft);
        toast.success('Configurações de hardware salvas!');
    };

    const handlePrintTest = () => {
        // Generate a temporary print window with the label style
        const printWindow = window.open('', '_blank', 'width=600,height=400');
        if (!printWindow) {
            toast.error('O bloqueador de pop-ups impediu a impressão de teste.');
            return;
        }

        const testLabelHtml = `
      <html>
        <head>
          <style>
            @page {
              size: ${printerProfile === 'thermal_60x40' ? '60mm 40mm' : 'A4'};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', sans-serif;
              display: flex;
              align-items: flex-start;
              justify-content: flex-start;
            }
            .print-container {
              width: ${printerProfile === 'thermal_60x40' ? '60mm' : '210mm'};
              height: ${printerProfile === 'thermal_60x40' ? '40mm' : '297mm'};
              padding-top: ${marginTop}mm;
              padding-left: ${marginLeft}mm;
              box-sizing: border-box;
            }
            .label-content {
              border: 1px dashed #ccc;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              padding: 2mm;
              box-sizing: border-box;
              font-size: 8pt;
            }
            .header { font-weight: bold; font-size: 10pt; border-bottom: 0.5pt solid #000; margin-bottom: 1mm; }
            .info { margin-bottom: 2mm; }
            .test-text { font-size: 7pt; color: #666; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="label-content">
              <div class="header">Teste de Impressão</div>
              <div class="info">
                <strong>Paciente:</strong> João da Silva Teste<br/>
                <strong>Perfil:</strong> ${printerProfile === 'thermal_60x40' ? 'Térmica 60x40mm' : 'Jato de Tinta A4'}<br/>
                <strong>Alinhamento:</strong> T: ${marginTop}mm | L: ${marginLeft}mm
              </div>
              <div class="test-text text-sm">Validando alinhamento e margens configuradas no sistema Integrallys.</div>
            </div>
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;

        printWindow.document.write(testLabelHtml);
        printWindow.document.close();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Webcam Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Camera className="h-5 w-5 text-[#0039A6]" />
                            <h3 className="text-lg font-normal text-[#101828] dark:text-white">Webcam para atendimento</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">Configure a câmera utilizada para captura de fotos de pacientes e telemedicina.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isSecure && (
                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 font-normal px-3 py-1 rounded-full gap-1">
                                <Lock className="w-3 h-3" /> Sem HTTPS
                            </Badge>
                        )}
                        {cameraStatus === 'connected' ? (
                            <Badge className="bg-[#0039A6] text-white border-none font-normal px-3 py-1 rounded-full">Conectado</Badge>
                        ) : cameraStatus === 'undetected' ? (
                            <Badge className="bg-red-500 text-white border-none font-normal px-3 py-1 rounded-full">Dispositivo não detectado</Badge>
                        ) : (
                            <Badge className="bg-amber-500 text-white border-none font-normal px-3 py-1 rounded-full">Erro de acesso</Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={detectCameras}
                            className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                        >
                            <RefreshCw className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-600 dark:text-gray-400">Selecione o dispositivo</Label>
                            <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                                <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-[#020817] border-gray-200 dark:border-white/10 font-normal">
                                    <SelectValue preferPlaceholder placeholder="Buscando câmeras..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {cameras.map((camera) => (
                                        <SelectItem key={camera.deviceId} value={camera.deviceId} className="font-normal text-sm">
                                            {camera.label || `Câmera ${camera.deviceId.slice(0, 5)}`}
                                        </SelectItem>
                                    ))}
                                    {cameras.length === 0 && <SelectItem value="none">Nenhuma câmera encontrada</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={startCamera}
                                disabled={isLoading}
                                className={`w-full h-11 rounded-xl font-normal gap-2 transition-all ${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-[#0039A6] hover:bg-[#002D7A]'} text-white shadow-sm`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Conectando...
                                    </>
                                ) : isStreaming ? (
                                    <>Parar preview</>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4" />
                                        Iniciar / testar câmera
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100/50 dark:border-blue-500/10">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
                                <p className="text-xs text-blue-700 dark:text-blue-400 font-normal leading-relaxed">
                                    A câmera selecionada será usada em todos os fluxos de atendimento do portal do especialista.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative aspect-video bg-gray-100 dark:bg-black/20 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 flex items-center justify-center">
                        {!isSecure && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-100/90 dark:bg-black/80 text-center p-6 backdrop-blur-sm">
                                <Lock className="h-10 w-10 text-amber-500 mb-2" />
                                <h4 className="text-gray-900 dark:text-white font-normal mb-1">Conexão Não Segura</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">A webcam requer HTTPS. Verifique suas configurações de servidor.</p>
                            </div>
                        )}

                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${isStreaming ? 'block' : 'hidden'}`}
                            style={{ transform: 'scaleX(-1)' }}
                        />

                        {isLoading && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-100/50 dark:bg-black/50 backdrop-blur-sm">
                                <Loader2 className="h-8 w-8 text-[#0039A6] animate-spin mb-2" />
                                <span className="text-sm font-medium text-[#0039A6] dark:text-blue-400">Iniciando câmera...</span>
                            </div>
                        )}

                        {!isStreaming && !isLoading && (
                            <div className="flex flex-col items-center gap-3 text-gray-400 overflow-hidden">
                                <Camera className="h-12 w-12 stroke-[1px]" />
                                <span className="text-sm font-normal">Preview da câmera</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="h-px bg-gray-100 dark:bg-white/5 w-full" />

            {/* Printer Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Printer className="h-5 w-5 text-[#0039A6]" />
                            <h3 className="text-lg font-normal text-[#101828] dark:text-white">Impressora e etiquetas</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">Gerencie perfis de impressão e ajustes finos de alinhamento.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-600 dark:text-gray-400">Perfil de impressão padrão</Label>
                            <Select value={printerProfile} onValueChange={setPrinterProfile}>
                                <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-[#020817] border-gray-200 dark:border-white/10 font-normal">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thermal_60x40" className="font-normal text-sm">Impressora térmica (60x40mm)</SelectItem>
                                    <SelectItem value="a4_inkjet" className="font-normal text-sm">Jato de tinta / laser (a4)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-normal text-gray-600 dark:text-gray-400">Ajuste fino de margens (mm)</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-normal">Margem superior</span>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={marginTop}
                                            onChange={(e) => setMarginTop(e.target.value)}
                                            className="h-11 rounded-xl bg-white dark:bg-[#020817] border-gray-200 dark:border-white/10 font-normal pr-10"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-normal">mm</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-normal">Margem esquerda</span>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={marginLeft}
                                            onChange={(e) => setMarginLeft(e.target.value)}
                                            className="h-11 rounded-xl bg-white dark:bg-[#020817] border-gray-200 dark:border-white/10 font-normal pr-10"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-normal">mm</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                variant="outline"
                                onClick={handlePrintTest}
                                className="w-full h-11 rounded-xl font-normal gap-2 border-[#0039A6]/20 hover:bg-[#0039A6]/5 dark:border-white/10 dark:hover:bg-white/5 dark:text-white"
                            >
                                <Printer className="h-4 w-4" />
                                Imprimir página de teste
                            </Button>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-black/10 rounded-2xl p-6 border border-gray-100 dark:border-white/5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Settings2 className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 font-normal">Log de detecção</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-200/50 dark:border-white/5">
                                <span className="text-xs text-gray-500 font-normal">Sistema operacional</span>
                                <span className="text-xs font-normal dark:text-gray-300">Windows / macOS / Linux</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-200/50 dark:border-white/5">
                                <span className="text-xs text-gray-500 font-normal">Drivers de impressão</span>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-normal text-[10px] px-2 py-0">Genérico / PCL</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-xs text-gray-500 font-normal">Resolução de preview</span>
                                <span className="text-xs font-normal dark:text-gray-300">1280 x 720 (HD)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Footer */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                <Button
                    variant="outline"
                    className="h-11 px-6 rounded-xl font-normal border-gray-200 dark:border-gray-700 dark:text-white"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSavePreferences}
                    className="h-11 px-10 rounded-xl bg-[#0039A6] hover:bg-[#002D7A] text-white font-normal shadow-lg shadow-[#0039A6]/10"
                >
                    Salvar configurações
                </Button>
            </div>
        </div>
    );
}

