"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'

interface ImageUploaderProps {
    value: string | string[];
    onChange: (url: string | string[]) => void;
    multiple?: boolean;
    className?: string;
}

export function ImageUploader({ value, onChange, multiple = false, className = "" }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);



    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        const newUrls: string[] = [];

        try {
            for (const originalFile of acceptedFiles) {
                // Client-side compression to avoid 4.5MB Serverless Limit & 413 Errors
                let file = originalFile;
                try {
                    const options = {
                        maxSizeMB: 1, // Max 1MB
                        maxWidthOrHeight: 1920, // Max 1920px
                        useWebWorker: true
                    };
                    const compressedBlob = await imageCompression(originalFile, options);
                    file = new File([compressedBlob], originalFile.name, { type: originalFile.type });
                    console.log(`Compressed ${originalFile.size / 1024 / 1024}MB -> ${file.size / 1024 / 1024}MB`);
                } catch (e) {
                    console.warn("Compression failed, trying original:", e);
                }

                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: 'Unknown server error' }));
                    throw new Error(err.error || 'Upload failed');
                }

                const data = await res.json();
                newUrls.push(data.url);
            }

            if (multiple) {
                const current = Array.isArray(value) ? value : [];
                onChange([...current, ...newUrls]);
            } else {
                onChange(newUrls[0]);
            }

        } catch (error: any) {
            console.error(error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    }, [value, onChange, multiple]);

    const removeImage = (indexToRemove: number) => {
        if (multiple && Array.isArray(value)) {
            onChange(value.filter((_, idx) => idx !== indexToRemove));
        } else {
            onChange("");
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple
    });

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:bg-secondary/50'}`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <Loader2 className="animate-spin text-muted-foreground" />
                ) : (
                    <>
                        <Upload className="text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">
                            {isDragActive ? "Drop files here..." : "Drag & drop or click to upload"}
                        </p>
                    </>
                )}
            </div>

            {/* Preview */}
            {multiple && Array.isArray(value) && value.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {value.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-md overflow-hidden bg-secondary group">
                            <Image src={url} alt="Preview" fill className="object-cover" />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!multiple && typeof value === 'string' && value && (
                <div className="relative w-full aspect-video rounded-md overflow-hidden bg-secondary group">
                    <Image src={value} alt="Preview" fill className="object-cover" />
                    <button
                        onClick={() => removeImage(0)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}
