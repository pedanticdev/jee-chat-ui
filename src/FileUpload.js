import React, {useCallback, useState} from 'react';
import {File, FileText, Image, Upload, X} from 'lucide-react';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {storage} from './firebase-config';
import {useAuth} from './AuthContext';

const FileUpload = ({ onUploadComplete, maxFileSize = 5242880 }) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Check if user has admin role
    const isAdmin = user?.role === 'admin';

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
        if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();

        if (!isAdmin) {
            setError('Only admin users can upload files');
            return;
        }

        const droppedFiles = e.dataTransfer?.files || e.target.files;
        const validFiles = Array.from(droppedFiles).filter(file => {
            if (file.size > maxFileSize) {
                setError(`${file.name} is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`);
                return false;
            }
            return true;
        });
        setFiles(prev => [...prev, ...validFiles]);
        setError(null);
    }, [maxFileSize, isAdmin]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (!files.length || !isAdmin) return;
        setUploading(true);
        setError(null);
        const uploadedUrls = [];

        try {
            for (const [index, file] of files.entries()) {
                // Upload to RAG directory
                const storageRef = ref(storage, `rag/${Date.now()}-${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(prev => ({
                                ...prev,
                                [index]: progress
                            }));
                        },
                        (error) => {
                            console.error('Upload error:', error);
                            reject(error);
                        },
                        async () => {
                            try {
                                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                                uploadedUrls.push({
                                    url: downloadUrl,
                                    name: file.name,
                                    type: file.type,
                                    path: `rag/${file.name}` // Store the path for reference
                                });
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                });
            }
            onUploadComplete?.(uploadedUrls);
            setFiles([]);
            setUploadProgress({});
        } catch (error) {
            setError('Failed to upload some files. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    if (!isAdmin) {
        return (
            <div className="w-full max-w-2xl mx-auto p-6 bg-red-50 text-red-600 rounded-lg">
                You need admin privileges to access this feature.
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Drop zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
                <input
                    type="file"
                    multiple
                    onChange={handleDrop}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-600">
                        Drop files here or click to upload to RAG storage
                    </span>
                    <span className="text-sm text-gray-500">
                        Maximum file size: {maxFileSize / 1024 / 1024}MB
                    </span>
                </label>
            </div>
            {/* Error message */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}
            {/* File list */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <span className="text-sm text-gray-700">
                                    {file.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                {uploadProgress[index] && (
                                    <div className="text-sm text-gray-500">
                                        {Math.round(uploadProgress[index])}%
                                    </div>
                                )}
                                <button
                                    onClick={() => removeFile(index)}
                                    className="text-gray-400 hover:text-red-500"
                                    disabled={uploading}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Upload button */}
                    <button
                        onClick={uploadFiles}
                        disabled={uploading}
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Upload className="w-4 h-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload {files.length} file{files.length !== 1 ? 's' : ''} to RAG
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;