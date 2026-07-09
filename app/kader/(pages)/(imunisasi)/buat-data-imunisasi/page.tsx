'use client';

import BottombarKader from '@/components/ui/bottombar/kader/BottombarKader';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useGetChildById } from '@/hooks/query/child/useManageChildren';
import { useGetVaccines, useCreateVaccine, useUpdateVaccine, useDeleteVaccine } from '@/hooks/query/vaccine/useManageVaccines';
import { useGetCadreProfile } from '@/hooks/query/cadre/useCadreProfile';
import { useGetImmunizationRecords, useCreateImmunizationRecord, useUpdateImmunizationRecord, useDeleteImmunizationRecord } from '@/hooks/query/immunization/useManageImmunizationRecords';
import { useCreateNutritionRecord } from '@/hooks/query/nutrition/useManageNutritionRecords';
import { useConfirm } from '@/providers/ConfirmProvider';
import ChildProfile from './ChildProfile';
import ImmunizationHistory from './ImmunizationHistory';
import ManageVaccinesModal from './ManageVaccinesModal';
import ImmunizationForm from './ImmunizationForm';

// Interfaces
interface HistoryItem {
    id: string;
    tanggal: string;
    jenis: string;
    status: 'Selesai' | 'Terjadwal' | 'Ditunda';
    keterangan: string;
}

function BuatDataImunisasiContent() {
    const searchParams = useSearchParams();
    const bayiIdParam = searchParams.get('bayiId');
    const namaParam = searchParams.get('nama');
    const confirm = useConfirm();

    // Fetch real child data
    const { data: childResponse, isLoading: isChildLoading } = useGetChildById(bayiIdParam || "");
    const child = childResponse?.data;

    const calculateAge = (birthDateStr?: string | null) => {
        if (!birthDateStr) return "-";
        const birthDate = new Date(birthDateStr);
        const today = new Date();
        let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
        months -= birthDate.getMonth();
        months += today.getMonth();
        if (months < 1) {
            const diffTime = Math.abs(today.getTime() - birthDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} Hari`;
        }
        return `${months} Bulan`;
    };

    const formatDateIndo = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const matchedBaby = child ? {
        id: child.id,
        nama: child.name,
        nik: child.identity_number,
        umur: calculateAge(child.birth_date),
        kelamin: child.gender === 'male' ? 'Laki-laki' : 'Perempuan',
        tanggalLahir: formatDateIndo(child.birth_date),
        orangTua: child.mother_name || "-",
        posyandu: child.posyandu_detail?.name || "-",
        terakhirDiperbarui: formatDateIndo(child.updated_at)
    } : null;

    // Fetch real vaccines
    const { data: vaccinesResponse } = useGetVaccines();
    const vaccinesList = vaccinesResponse?.data?.data || [];

    const createVaccineMutation = useCreateVaccine();
    const updateVaccineMutation = useUpdateVaccine();
    const deleteVaccineMutation = useDeleteVaccine();

    // Fetch cadre profile
    const { data: cadreProfile } = useGetCadreProfile();

    // Fetch real immunization records
    const { data: immunizationResponse } = useGetImmunizationRecords({ children_id: bayiIdParam || "" });
    const immunizationRecordsList = immunizationResponse?.data || [];

    const createImmunizationMutation = useCreateImmunizationRecord();
    const updateImmunizationMutation = useUpdateImmunizationRecord();
    const deleteImmunizationMutation = useDeleteImmunizationRecord();
    const createNutritionMutation = useCreateNutritionRecord();

    // Collapsible states
    const [showHistory, setShowHistory] = useState(false);

    // Map database records to UI HistoryItems
    const history: HistoryItem[] = immunizationRecordsList.map((rec) => {
        const matchingVaccine = vaccinesList.find((v) => v.id === rec.vaccine_id);
        const statusMap: Record<string, 'Selesai' | 'Terjadwal' | 'Ditunda'> = {
            completed: 'Selesai',
            scheduled: 'Terjadwal',
            not_yet: 'Ditunda',
            missed: 'Ditunda'
        };
        return {
            id: rec.id,
            tanggal: rec.date_given ? new Date(rec.date_given).toISOString().split('T')[0] : '',
            jenis: matchingVaccine?.name || 'Vaksin Tidak Dikenal',
            status: statusMap[rec.status] || 'Ditunda',
            keterangan: rec.notes || ''
        };
    });

    // Form inputs state
    const [tanggalEntry, setTanggalEntry] = useState('');
    const [jenisImunisasi, setJenisImunisasi] = useState('');
    const [status, setStatus] = useState<'Selesai' | 'Terjadwal' | 'Ditunda'>('Selesai');
    const [keterangan, setKeterangan] = useState('');

    // Nutrition states
    const [latestNutrition, setLatestNutrition] = useState<{
        measurement_date?: string;
        weight_kg?: string;
        height_cm?: string;
        head_circumference_cm?: string;
        age_months?: number;
    } | null>(null);
    const [tanggalPengukuran, setTanggalPengukuran] = useState('');
    const [usiaSaatUkur, setUsiaSaatUkur] = useState('');
    const [beratBadan, setBeratBadan] = useState('');
    const [tinggiBadan, setTinggiBadan] = useState('');
    const [lingkarKepala, setLingkarKepala] = useState('');
    const [nutritionStatus, setNutritionStatus] = useState<'normal' | 'underweight' | 'severely_underweight' | 'stunted' | 'wasted' | 'overweight'>('normal');

    // Editing State
    const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);

    // Notification states
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Manage Immunization Types State
    const [showManageModal, setShowManageModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTypeName, setNewTypeName] = useState('');
    const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
    const [editingTypeName, setEditingTypeName] = useState('');

    // Set initial dropdown vaccine name
    useEffect(() => {
        if (vaccinesList.length > 0 && !jenisImunisasi) {
            setJenisImunisasi(vaccinesList[0].name);
        }
    }, [vaccinesList, jenisImunisasi]);

    // Manage Immunization Types Handlers
    const handleAddType = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newTypeName.trim();
        if (!trimmed) return;
        
        if (vaccinesList.some(item => item.name.toLowerCase() === trimmed.toLowerCase())) {
            alert('Jenis imunisasi sudah ada!');
            return;
        }

        let code = trimmed.slice(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!code) code = 'V' + Math.floor(100000 + Math.random() * 900000);
        
        createVaccineMutation.mutate({
            name: trimmed,
            code: code
        }, {
            onSuccess: () => {
                setNewTypeName('');
                triggerToast('Jenis imunisasi berhasil ditambahkan!');
            },
            onError: (err: any) => {
                alert(err?.response?.data?.message || err?.message || 'Gagal menambahkan jenis imunisasi');
            }
        });
    };

    const handleUpdateType = (id: string, nameBeforeUpdate: string) => {
        const trimmed = editingTypeName.trim();
        if (!trimmed) return;
        
        if (nameBeforeUpdate === trimmed) {
            setEditingTypeId(null);
            return;
        }

        if (vaccinesList.some((item) => item.id !== id && item.name.toLowerCase() === trimmed.toLowerCase())) {
            alert('Jenis imunisasi sudah ada!');
            return;
        }

        let code = trimmed.slice(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!code) code = 'V' + Math.floor(100000 + Math.random() * 900000);

        updateVaccineMutation.mutate({
            id,
            payload: {
                name: trimmed,
                code: code
            }
        }, {
            onSuccess: () => {
                if (jenisImunisasi === nameBeforeUpdate) {
                    setJenisImunisasi(trimmed);
                }
                setEditingTypeId(null);
                setEditingTypeName('');
                triggerToast('Jenis imunisasi berhasil diperbarui!');
            },
            onError: (err: any) => {
                alert(err?.response?.data?.message || err?.message || 'Gagal memperbarui jenis imunisasi');
            }
        });
    };

    const handleDeleteType = async (id: string, nameToDelete: string) => {
        if (await confirm(`Apakah Anda yakin ingin menghapus jenis imunisasi "${nameToDelete}"?`)) {
            deleteVaccineMutation.mutate(id, {
                onSuccess: () => {
                    const remainingList = vaccinesList.filter(item => item.id !== id);
                    if (jenisImunisasi === nameToDelete) {
                        setJenisImunisasi(remainingList[0]?.name || '');
                    }
                    triggerToast('Jenis imunisasi berhasil dihapus!');
                },
                onError: (err: any) => {
                    alert(err?.response?.data?.message || err?.message || 'Gagal menghapus jenis imunisasi');
                }
            });
        }
    };

    const filteredList = vaccinesList.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Prefill date with today's date in YYYY-MM-DD format
    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setTanggalEntry(`${yyyy}-${mm}-${dd}`);
        setTanggalPengukuran(`${yyyy}-${mm}-${dd}`);
    }, []);

    // Set initial nutrition from child details
    useEffect(() => {
        if (child?.latest_nutrition) {
            setLatestNutrition(child.latest_nutrition);
            const ln = child.latest_nutrition;
            if (ln.measurement_date) {
                try {
                    const dateVal = new Date(ln.measurement_date).toISOString().split('T')[0];
                    setTanggalPengukuran(dateVal);
                } catch (e) {
                    setTanggalPengukuran('');
                }
            }
            if (ln.age_months !== undefined && ln.age_months !== null) {
                setUsiaSaatUkur(String(ln.age_months));
            }
            if (ln.weight_kg !== undefined && ln.weight_kg !== null) {
                setBeratBadan(String(ln.weight_kg));
            }
            if (ln.height_cm !== undefined && ln.height_cm !== null) {
                setTinggiBadan(String(ln.height_cm));
            }
            if (ln.head_circumference_cm !== undefined && ln.head_circumference_cm !== null) {
                setLingkarKepala(String(ln.head_circumference_cm));
            }
        }
    }, [child]);

    // Set form fields if editing
    useEffect(() => {
        if (editingItem) {
            setTanggalEntry(editingItem.tanggal);
            setJenisImunisasi(editingItem.jenis);
            setStatus(editingItem.status);
            setKeterangan(editingItem.keterangan);
        } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            setTanggalEntry(`${yyyy}-${mm}-${dd}`);
            setJenisImunisasi(vaccinesList[0]?.name || '');
            setStatus('Selesai');
            setKeterangan('');
        }
    }, [editingItem, vaccinesList]);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2500);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Submit Child Measurement / Nutrition Record if fields are filled
        if (beratBadan || tinggiBadan || lingkarKepala) {
            createNutritionMutation.mutate({
                children_id: bayiIdParam || "",
                measurement_date: tanggalPengukuran || tanggalEntry,
                weight_kg: beratBadan || null,
                height_cm: tinggiBadan || null,
                head_circumference_cm: lingkarKepala || null,
                age_months: usiaSaatUkur ? parseInt(usiaSaatUkur) : null,
                nutrition_status: nutritionStatus,
                cadre_id: cadreProfile?.id || null,
                notes: keterangan || null
            }, {
                onError: (err: any) => {
                    console.error("Gagal menyimpan data gizi:", err);
                }
            });
        }

        // 2. Submit Immunization Record
        const statusMapInv: Record<'Selesai' | 'Terjadwal' | 'Ditunda', 'completed' | 'scheduled' | 'not_yet'> = {
            'Selesai': 'completed',
            'Terjadwal': 'scheduled',
            'Ditunda': 'not_yet'
        };

        const selectedVaccine = vaccinesList.find(v => v.name === jenisImunisasi);
        if (!selectedVaccine) {
            alert("Pilih jenis imunisasi yang valid!");
            return;
        }

        if (editingItem) {
            // Update mode
            const originalRecord = immunizationRecordsList.find(r => r.id === editingItem.id);
            const originalDose = originalRecord?.dose_number || 1;

            updateImmunizationMutation.mutate({
                id: editingItem.id,
                payload: {
                    vaccine_id: selectedVaccine.id,
                    dose_number: selectedVaccine.name !== editingItem.jenis 
                        ? (immunizationRecordsList.filter(r => r.vaccine_id === selectedVaccine.id).length + 1)
                        : originalDose,
                    date_given: tanggalEntry || null,
                    status: statusMapInv[status],
                    notes: keterangan || null,
                    cadre_id: cadreProfile?.id || null,
                    posyandu_id: cadreProfile?.posyandu_id || null
                }
            }, {
                onSuccess: () => {
                    triggerToast('Data Imunisasi berhasil diperbarui!');
                    setEditingItem(null);
                    setKeterangan('');
                    setBeratBadan('');
                    setTinggiBadan('');
                    setLingkarKepala('');
                    setUsiaSaatUkur('');
                },
                onError: (err: any) => {
                    alert(err?.response?.data?.message || err?.message || 'Gagal memperbarui data imunisasi');
                }
            });
        } else {
            // Create mode
            const existingVacsCount = immunizationRecordsList.filter(
                (rec) => rec.vaccine_id === selectedVaccine.id
            ).length;
            const doseNumber = existingVacsCount + 1;

            createImmunizationMutation.mutate({
                children_id: bayiIdParam || "",
                vaccine_id: selectedVaccine.id,
                dose_number: doseNumber,
                date_given: tanggalEntry || null,
                status: statusMapInv[status],
                notes: keterangan || null,
                cadre_id: cadreProfile?.id || null,
                posyandu_id: cadreProfile?.posyandu_id || null
            }, {
                onSuccess: () => {
                    triggerToast('Data Imunisasi baru berhasil ditambahkan!');
                    // Reset inputs
                    const today = new Date();
                    const yyyy = today.getFullYear();
                    const mm = String(today.getMonth() + 1).padStart(2, '0');
                    const dd = String(today.getDate()).padStart(2, '0');
                    setTanggalEntry(`${yyyy}-${mm}-${dd}`);
                    setJenisImunisasi(vaccinesList[0]?.name || '');
                    setStatus('Selesai');
                    setKeterangan('');
                    setBeratBadan('');
                    setTinggiBadan('');
                    setLingkarKepala('');
                    setUsiaSaatUkur('');
                },
                onError: (err: any) => {
                    alert(err?.response?.data?.message || err?.message || 'Gagal menambahkan data imunisasi');
                }
            });
        }
    };

    const handleEditItem = (item: HistoryItem) => {
        setEditingItem(item);
        // Scroll to form nicely
        const formEl = document.getElementById('imunisasi-form');
        if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (editingItem?.id === id) {
            setEditingItem(null);
        }
        if (await confirm("Apakah Anda yakin ingin menghapus data imunisasi ini?")) {
            deleteImmunizationMutation.mutate(id, {
                onSuccess: () => {
                    triggerToast('Data Imunisasi berhasil dihapus!');
                },
                onError: (err: any) => {
                    alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data imunisasi');
                }
            });
        }
    };

    const getStatusColor = (statusVal: string) => {
        switch (statusVal) {
            case 'Selesai':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Terjadwal':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Ditunda':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (isChildLoading) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (!matchedBaby) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-slate-800 mb-2">Bayi tidak ditemukan</h2>
                    <p className="text-sm text-slate-500 mb-6">Data bayi tidak ada atau ID tidak valid.</p>
                    <Link href="/kader/data-imunisasi" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-colors">
                        Kembali
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-b-[2.5rem]"></div>

                {/* Sticky Nav Header */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/kader/data-imunisasi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Imunisasi Bayi</h1>
                    <div className="w-10 h-10"></div> {/* Spacing balance */}
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-28">

                    {/* Profile & Administrative Cards */}
                    <ChildProfile
                        child={child!}
                        calculateAge={calculateAge}
                        formatDateIndo={formatDateIndo}
                    />

                    {/* History Collapsible Section */}
                    <ImmunizationHistory
                        history={history}
                        showHistory={showHistory}
                        setShowHistory={setShowHistory}
                        formatDateIndo={formatDateIndo}
                        getStatusColor={getStatusColor}
                        handleEditItem={handleEditItem}
                        handleDeleteItem={handleDeleteItem}
                    />

                    {/* Entry Form */}
                    <ImmunizationForm
                        editingItem={editingItem}
                        setEditingItem={setEditingItem}
                        tanggalEntry={tanggalEntry}
                        setTanggalEntry={setTanggalEntry}
                        jenisImunisasi={jenisImunisasi}
                        setJenisImunisasi={setJenisImunisasi}
                        status={status}
                        setStatus={setStatus}
                        tanggalPengukuran={tanggalPengukuran}
                        setTanggalPengukuran={setTanggalPengukuran}
                        usiaSaatUkur={usiaSaatUkur}
                        setUsiaSaatUkur={setUsiaSaatUkur}
                        beratBadan={beratBadan}
                        setBeratBadan={setBeratBadan}
                        tinggiBadan={tinggiBadan}
                        setTinggiBadan={setTinggiBadan}
                        lingkarKepala={lingkarKepala}
                        setLingkarKepala={setLingkarKepala}
                        nutritionStatus={nutritionStatus}
                        setNutritionStatus={setNutritionStatus}
                        keterangan={keterangan}
                        setKeterangan={setKeterangan}
                        vaccinesList={vaccinesList}
                        setShowManageModal={setShowManageModal}
                        handleFormSubmit={handleFormSubmit}
                    />
                </div>

                {/* Manage Immunization Modal */}
                <ManageVaccinesModal
                    showManageModal={showManageModal}
                    setShowManageModal={setShowManageModal}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    newTypeName={newTypeName}
                    setNewTypeName={setNewTypeName}
                    editingTypeId={editingTypeId}
                    setEditingTypeId={setEditingTypeId}
                    editingTypeName={editingTypeName}
                    setEditingTypeName={setEditingTypeName}
                    filteredList={filteredList}
                    handleAddType={handleAddType}
                    handleUpdateType={handleUpdateType}
                    handleDeleteType={handleDeleteType}
                    setJenisImunisasi={setJenisImunisasi}
                    triggerToast={triggerToast}
                />

                {/* Toast Notification */}
                {showToast && (
                    <div className="absolute bottom-[92px] left-1/2 -translate-x-1/2 w-[85%] bg-slate-900/90 text-white text-xs font-bold px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-[1000] animate-fade-in backdrop-blur-sm border border-white/10">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="flex-1 text-slate-100">{toastMessage}</span>
                    </div>
                )}

                {/* Bottom Navigation */}
                <BottombarKader />
            </div>
        </div>
    );
}

export default function BuatDataImunisasi() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <BuatDataImunisasiContent />
        </Suspense>
    );
}
