import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, GraduationCap, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Program & Kurikulum | Takhossus Pasca Amtsilati",
  description: "Panduan lengkap kurikulum dan akademik berbasis kompetisi dan kompetensi.",
};

// --- DATA DARI BUKU PANDUAN (PDF) ---

const stages = [
  {
    id: "akhlaq1",
    title: "1. Fan Akhlaq 1",
    duration: "1 Bulan",
    materials: [
      { no: 1, mapel: "Akhlaq Mulia 1", kitab: "Akhlaq Mulia 1", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 2, mapel: "Kitab Niat 1", kitab: "Kitab Niat 1", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 3, mapel: "Adabun Nabawi 1", kitab: "Adabun Nabawi 1", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 4, mapel: "Adabun Nabawi 2", kitab: "Adabun Nabawi 2", ket: "Dikaji + Tes Lisan", kkm: 90 },
    ],
  },
  {
    id: "thoharoh",
    title: "2. Thoharoh",
    duration: "3 - 6 Bulan",
    materials: [
      { no: 1, mapel: "Fathul Mu'in 1", kitab: "Fathul Mu'in", ket: "Dikaji + Tes Tulis + Tes Baca", kkm: 92 },
      { no: 2, mapel: "Fathul Qorib 1", kitab: "Fathul Ajib / Qorib", ket: "Dikaji + Tes Tulis", kkm: 92 },
      { no: 3, mapel: "Fiqhun Nisa'", kitab: "Fiqhun Nisa'", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 4, mapel: "Hubbun Nabi", kitab: "Hubbun Nabi", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 5, mapel: "Hadits Arba'in", kitab: "Syarah Hadits Arba'in", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 6, mapel: "Kailani", kitab: "Kailani", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 7, mapel: "I'lal", kitab: "I'lal", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 8, mapel: "Tauhid", kitab: "Kifayatul Awwam", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 9, mapel: "Alfiyah 1 (1-100)", kitab: "Alfiyah Ibnu Aqil", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 10, mapel: "Alfiyah 2 (101-200)", kitab: "Alfiyah Ibnu Aqil", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 11, mapel: "Alfiyah 3 (201-300)", kitab: "Alfiyah Ibnu Aqil", ket: "Dikaji + Tes Lisan", kkm: 90 },
    ],
  },
  {
    id: "ubudiyyah",
    title: "3. Ubudiyyah",
    duration: "6 - 9 Bulan",
    materials: [
      { no: 1, mapel: "Fathul Mu'in 2 & 3", kitab: "Fathul Mu'in", ket: "Dikaji + Tes Tulis + Tes Baca", kkm: 92 },
      { no: 2, mapel: "Fathul Qorib 2", kitab: "Fathul Qorib", ket: "Dikaji + Tes Tulis", kkm: 92 },
      { no: 3, mapel: "Faroid", kitab: "Zahrotul Faridhoh", ket: "Dikaji + Tes Tulis", kkm: 90 },
      { no: 4, mapel: "Ushul Fiqh", kitab: "Mabadi' Awaliyyah", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 5, mapel: "Qowaid Fiqh", kitab: "Mabadi' Awaliyyah", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 6, mapel: "Ilmu Hadist", kitab: "Qowaidul Asasiyyah", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 7, mapel: "Alfiyah (301-650)", kitab: "Alfiyah Ibnu Aqil", ket: "Dikaji + Tes Lisan", kkm: 90 },
    ],
  },
  {
    id: "munakahat",
    title: "4. Munakahat",
    duration: "6 - 9 Bulan",
    materials: [
      { no: 1, mapel: "Fathul Mu'in 4 & 5", kitab: "Fathul Mu'in", ket: "Dikaji + Tes Tulis + Tes Baca", kkm: 92 },
      { no: 2, mapel: "Fathul Qorib 3", kitab: "Fathul Qorib", ket: "Dikaji + Tes Tulis", kkm: 92 },
      { no: 3, mapel: "Falak", kitab: "An Nuqthoh", ket: "Dikaji + Tes Tulis", kkm: 90 },
      { no: 4, mapel: "Tafsir", kitab: "Tafsir Al Mubarok", ket: "Dikaji + Tes Tulis", kkm: 90 },
      { no: 5, mapel: "Balaghoh", kitab: "Husnu As-Syiaghoh", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 6, mapel: "Mantiq", kitab: "Sulam Munawroq", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 7, mapel: "Ilmu Al-Qur'an", kitab: "Qowaidul Asasiyyah", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 8, mapel: "Alfiyah (651-1002)", kitab: "Alfiyah Ibnu Aqil", ket: "Dikaji + Tes Lisan", kkm: 90 },
    ],
  },
  {
    id: "akhlaq2",
    title: "5. Fan Akhlaq 2",
    duration: "1 Bulan",
    materials: [
      { no: 1, mapel: "Adabun Nabawi 3", kitab: "Adabun Nabawi 3", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 2, mapel: "Adabun Nabawi 4", kitab: "Adabun Nabawi 4", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 3, mapel: "Akhlaq Mulia 2", kitab: "Akhlaq Mulia 2", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 4, mapel: "Kitab Niat 2", kitab: "Kitab Niat 2", ket: "Dikaji + Tes Lisan", kkm: 90 },
      { no: 5, mapel: "Kitab Sholat", kitab: "Kitab Sholat", ket: "Dikaji + Tes Lisan", kkm: 90 },
    ],
  },
];

const testProcedures = [
  {
    title: "1. Prosedur Pendaftaran Tes",
    content: [
      "Pendaftaran tes tulis dan lisan dibuka setiap hari.",
      "Tes dilaksanakan besok harinya setelah pendaftaran.",
      "Pendaftaran munaqosyah dibuka setiap hari (kecuali Selasa & Jumat).",
      "Pelaksanaan tes munaqosyah: Hari Sabtu dan Selasa.",
      "Biaya pendaftaran: Tes Lisan/Tulis (Rp 2.000), Tes Munaqosyah (Rp 10.000)."
    ]
  },
  {
    title: "2. Prosedur Tes Lisan",
    content: [
      "Dewan penguji membacakan soal, peserta menjawab.",
      "Waktu menjawab maksimal 30 detik per soal.",
      "Penilaian menggunakan angka (bukan lulus/her).",
      "Nilai minimal lulus: 90, Maksimal: 100."
    ]
  },
  {
    title: "3. Prosedur Tes Tulis",
    content: [
      "Jenis soal Pilihan Ganda (A, B, C) sejumlah 25 butir soal.",
      "Peserta mengisi lembar jawab dalam batas waktu yang ditentukan.",
      "Nilai minimal lulus: 9.2, Maksimal: 10."
    ]
  },
  {
    title: "4. Prosedur Tes Baca Kitab",
    content: [
      "Peserta mengambil maqro' yang disediakan di majlis munaqosyah.",
      "Langsung mendapat poin 10 saat mulai.",
      "Setiap salah 2 kali, poin dikurangi 1.",
      "Jika peserta bisa membenarkan kesalahan yang diajukan penguji, poin dikembalikan.",
      "Penilaian meliputi: Amtsilati, Makna, dan Pemahaman.",
      "Nilai minimal lulus: 70."
    ]
  },
  {
    title: "5. Tes Akhir Kelulusan",
    content: [
      "Santri telah menyelesaikan semua SKS dari Fan Thoharoh sampai Fan Akhlaq 2.",
      "Dilaksanakan serentak.",
      "Tes baca 'Ammah kitab Fathul Mu'in selama 3 hari (Thoharoh, Ubudiyyah, Munakahat).",
      "Mengikuti tes tulis akhir kelulusan sesuai jadwal akademik."
    ]
  }
];

export default function ProgramPage() {
  return (
    <div className="pt-nav bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Kurikulum & Akademik</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            [cite_start]Takhossus Pasca Amtsilati Berbasis Kompetisi dan Kompetensi [cite: 5]
          </p>
          <div className="mt-8 flex justify-center gap-4 text-sm font-medium">
             <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Kitab Kuning
             </div>
             <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Kompetensi
             </div>
          </div>
        </div>
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.png')] opacity-10"></div>
      </section>

      {/* INTRO SECTION */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pendahuluan</h2>
            <p className="text-gray-600 leading-relaxed">
              Program ini dirancang untuk menyelaraskan kemampuan santri putra dan putri serta menegaskan kembali esensi 
              Takhossus Pasca Amtsilati. Kurikulum disusun secara sistematis dan bertingkat untuk menjamin penguasaan materi 
              [cite_start]kitab kuning secara mendalam. [cite: 19]
            </p>
        </div>

        {/* TABEL KURIKULUM (TABS) */}
        <div className="max-w-5xl mx-auto mb-20">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BookOpen className="text-blue-600"/> Jenjang Pendidikan
            </h3>
            
            <Tabs defaultValue="thoharoh" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto mb-8 bg-white shadow-sm border p-1 rounded-xl">
                    {stages.map((stage) => (
                        <TabsTrigger 
                            key={stage.id} 
                            value={stage.id}
                            className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs md:text-sm"
                        >
                            {stage.title.replace(/^\d+\.\s/, '')}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {stages.map((stage) => (
                    <TabsContent key={stage.id} value={stage.id}>
                        <Card>
                            <CardHeader className="bg-gray-50 border-b">
                                <div className="flex justify-between items-center">
                                    <CardTitle>{stage.title}</CardTitle>
                                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                                        [cite_start]Estimasi: {stage.duration} [cite: 26, 32, 38]
                                    </span>
                                </div>
                                <CardDescription>Daftar muatan materi dan standar kelulusan (KKM).</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px] text-center">No</TableHead>
                                            <TableHead>Materi / Mapel</TableHead>
                                            <TableHead className="hidden md:table-cell">Kitab Rujukan</TableHead>
                                            <TableHead className="hidden md:table-cell">Metode</TableHead>
                                            <TableHead className="text-right">KKM</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {stage.materials.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="text-center font-medium">{item.no}</TableCell>
                                                <TableCell className="font-semibold text-gray-700">
                                                    {item.mapel}
                                                    <div className="md:hidden text-xs text-gray-500 font-normal mt-1">
                                                        {item.kitab} • {item.ket}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{item.kitab}</TableCell>
                                                <TableCell className="hidden md:table-cell text-sm text-gray-600">{item.ket}</TableCell>
                                                <TableCell className="text-right font-bold text-blue-600">{item.kkm}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>

        {/* SISTEM TES AKADEMIK (ACCORDION) */}
        <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                [cite_start]<FileText className="text-blue-600"/> Prosedur & Sistem Tes [cite: 56]
            </h3>
            
            <Card className="border-none shadow-md">
                <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                        {testProcedures.map((proc, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left font-semibold text-gray-700 hover:text-blue-600">
                                    {proc.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2 text-gray-600 ml-2">
                                        {proc.content.map((li, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                                <span>{li}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}