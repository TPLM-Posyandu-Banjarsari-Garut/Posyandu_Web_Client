"use client";

import { useState } from "react";
import { useLogoutAdmin } from "@/hooks/query/authAdmin/UseLogoutAdmin";
import {
  useGetPosyandus,
  useCreatePosyandu,
  useUpdatePosyandu,
  useDeletePosyandu,
} from "@/hooks/query/posyandu/useManagePosyandu";
import { Posyandu } from "@/interfaces/posyandu";
import axios from "axios";
import { useConfirm } from "@/providers/ConfirmProvider";

// Helper to parse address_line into jalan and patokan
const parseAddress = (addressLine: string | null | undefined) => {
  if (!addressLine) return { jalan: "", patokan: "" };
  const parts = addressLine.split(" | Patokan: ");
  if (parts.length > 1) {
    return { jalan: parts[0], patokan: parts[1] };
  }
  return { jalan: addressLine, patokan: "" };
};

export function useManagePosyanduPage() {
  const logout = useLogoutAdmin();
  const confirm = useConfirm();

  // Search filter & pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Query to get Posyandus from API
  const { data: posyandusResponse, isLoading } = useGetPosyandus({
    search: searchQuery || undefined,
    page: page,
    limit: 5, // Expose 5 items per page for tidy UI
  });

  const allPosyandus = posyandusResponse?.data || [];
  const totalItems = posyandusResponse?.meta?.total_items || 0;
  const totalPages = posyandusResponse?.meta?.total_pages || 1;

  // Mutations
  const createMutation = useCreatePosyandu();
  const updateMutation = useUpdatePosyandu();
  const deleteMutation = useDeletePosyandu();

  // Modal & Toast states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Posyandu | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [jalan, setJalan] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [patokan, setPatokan] = useState("");
  const [villageName, setVillageName] = useState(""); // Tempat Pelaksanaan
  const [formError, setFormError] = useState("");

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 1500);
  };

  // Open modal for addition
  const openAddModal = () => {
    setEditingItem(null);
    setName("");
    setJalan("");
    setRt("");
    setRw("");
    setPatokan("");
    setVillageName("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (item: Posyandu) => {
    const { jalan: parsedJalan, patokan: parsedPatokan } = parseAddress(item.address_line);
    setEditingItem(item);
    setName(item.name);
    setJalan(parsedJalan);
    setRt(item.rt || "");
    setRw(item.rw || "");
    setPatokan(parsedPatokan);
    setVillageName(item.village_name || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormError("");
  };

  // Handle delete
  const handleDeletePosyandu = async (publicId: string, name: string) => {
    if (await confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
      deleteMutation.mutate(publicId, {
        onSuccess: () => {
          showToast(`Posyandu "${name}" berhasil dihapus`);
          // If we delete the last item on the page, go to previous page
          if (allPosyandus.length === 1 && page > 1) {
            setPage((prev) => prev - 1);
          }
        },
        onError: (err: any) => {
          let msg = "Gagal menghapus posyandu";
          if (axios.isAxiosError(err)) {
            msg = err.response?.data?.message || msg;
          }
          alert(msg);
        },
      });
    }
  };

  // Handle Form Submission (Save/Update)
  const handleSavePosyandu = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !jalan.trim() || !rt.trim() || !rw.trim() || !villageName.trim()) {
      setFormError("Semua kolom form wajib diisi (kecuali Patokan)!");
      return;
    }

    const address_line = patokan.trim() ? `${jalan} | Patokan: ${patokan}` : jalan;

    if (editingItem) {
      // Update posyandu
      updateMutation.mutate(
        {
          publicId: editingItem.id,
          payload: {
            name,
            address_line,
            rt,
            rw,
            village_name: villageName,
          },
        },
        {
          onSuccess: () => {
            showToast(`Posyandu "${name}" berhasil diperbarui!`);
            closeModal();
          },
          onError: (err: any) => {
            let msg = "Gagal memperbarui posyandu";
            if (axios.isAxiosError(err)) {
              msg = err.response?.data?.message || msg;
            }
            setFormError(msg);
          },
        }
      );
    } else {
      // Create new posyandu
      createMutation.mutate(
        {
          name,
          address_line,
          rt,
          rw,
          village_name: villageName,
          status: "active",
        },
        {
          onSuccess: () => {
            showToast(`Posyandu "${name}" berhasil ditambahkan!`);
            closeModal();
            setPage(1); // Return to first page to see the new posyandu
          },
          onError: (err: any) => {
            let msg = "Gagal menambahkan posyandu baru";
            if (axios.isAxiosError(err)) {
              msg = err.response?.data?.message || msg;
            }
            setFormError(msg);
          },
        }
      );
    }
  };

  const isMutating =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    logout,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    isLoading,
    totalItems,
    totalPages,
    allPosyandus,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    showSuccessModal,
    successMessage,
    // Form fields
    name,
    setName,
    jalan,
    setJalan,
    rt,
    setRt,
    rw,
    setRw,
    patokan,
    setPatokan,
    villageName,
    setVillageName,
    formError,
    // Operations
    openAddModal,
    openEditModal,
    closeModal,
    handleDeletePosyandu,
    handleSavePosyandu,
    isMutating,
  };
}
