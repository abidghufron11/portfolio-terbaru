# Public Assets Directory

This directory is located at the root of the project (outside of `src`). It is used for static assets that you want served at the root path of your application.

## How to use PDFs for Certification / Verification Credentials:

1. Create a folder inside this directory, e.g., `public/credentials/` or just place the files directly here.
2. Put your credential PDF files here. For example: `public/credentials/react-cert.pdf`
3. In `src/data.ts`, update the `credentialUrl` property to the root-relative path of your PDF.

### Example in `src/data.ts`:

```typescript
export const certificatesData: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Bimbingan Kerja & Karir',
    issuer: 'BKK SMK PGRI 2 PONOROGO',
    date: 'November 2021',
    imageUrl: '/public/BKK.png', 
    credentialUrl: '/public/Sertif-BKK.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-2',
    title: 'UKK Kubota',
    issuer: 'PT. Kubota Indonesia',
    date: 'Mei 2022',
    imageUrl: '/public/Kubota.png', 
    credentialUrl: '/public/Sertif-Kubota.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-3',
    title: 'Pendidikan Sistem Ganda',
    issuer: 'PT. Inter Tehnik Gemilang',
    date: 'September 2021',
    imageUrl: '/public/Magang.png', 
    credentialUrl: '/public/Sertif-Magang.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-4',
    title: 'Seminar Nasional & Pelatihan Minat Bakat',
    issuer: 'Himpunan Mahasiswa Akuntansi',
    date: 'Agustus 2024',
    imageUrl: '/public/Seminar.png', 
    credentialUrl: '/public/Sertif-Seminar.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-5',
    title: 'Sertifikasi Komputer',
    issuer: 'Trust Training Partners',
    date: 'Februari 2024',
    imageUrl: '/public/Serkom.png', 
    credentialUrl: '/public/Sertif-Serkom.pdf' // <-- Relative to public root
  },
  {
    id: 'cert-6',
    title: 'UKK United Tractors',
    issuer: 'SMK PGRI 2 PONOROGO',
    date: 'April 2022',
    imageUrl: '/public/UKK UT.png', 
    credentialUrl: '/public/Sertif-UKK-UT.pdf' // <-- Relative to public root
  },
];
```

When users click "Buka Kredensial Resmi" (Open Official Credential) in the modal, it will open the PDF directly in a new tab!
