import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import logoUrl from '../assets/logo-full.png'
import { site } from '../config/site.js'
import { proformaInfo, CAD_TO_XAF, RATE_DATE, xaf, cad } from '../config/tarifs.js'

const BLUE = [0, 49, 151]
const RED = [222, 28, 26]
const INK = [12, 21, 48]
const GREY = [100, 110, 130]

// Les polices standard des PDF ne gèrent pas certains caractères typographiques.
const clean = (s) => String(s).replace(/[’‘]/g, "'").replace(/œ/g, 'oe').replace(/Œ/g, 'OE').replace(/…/g, '...').replace(/[  ]/g, ' ')

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

export function proformaNumber() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `PF-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`
}

export async function generateProforma({ estimate, serviceTitle, client, adults, children }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 16
  const number = proformaNumber()
  const today = new Date()
  const until = new Date(today.getTime() + proformaInfo.validiteJours * 86400000)
  const fmt = (d) => d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  // Bandeau supérieur
  doc.setFillColor(...BLUE); doc.rect(0, 0, W, 4, 'F')
  doc.setFillColor(...RED); doc.rect(W * 0.72, 0, W * 0.28, 4, 'F')
  try {
    const img = await loadImage(logoUrl)
    const lw = 62
    doc.addImage(img, 'PNG', M, 11, lw, (lw * img.height) / img.width)
  } catch { /* logo indisponible */ }

  doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.setTextColor(...BLUE)
  doc.text('PROFORMA', W - M, 20, { align: 'right' })
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...GREY)
  doc.text(clean(`N° ${number}`), W - M, 26, { align: 'right' })
  doc.text(clean(`Date : ${fmt(today)}`), W - M, 31, { align: 'right' })
  doc.text(clean(`Valable jusqu'au : ${fmt(until)}`), W - M, 36, { align: 'right' })

  // Émetteur / client
  let y = 44
  doc.setDrawColor(225, 230, 240); doc.line(M, y - 4, W - M, y - 4)
  doc.setFontSize(8); doc.setTextColor(...RED); doc.setFont('helvetica', 'bold')
  doc.text('ÉMETTEUR', M, y); doc.text('CLIENT', W / 2 + 4, y)
  doc.setTextColor(...INK); doc.setFontSize(10)
  doc.text(clean(proformaInfo.raisonSociale), M, y + 6)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...GREY)
  const em = [
    proformaInfo.slogan,
    ...site.offices.map((o) => `Bureau de ${o.city} : ${o.phone}`),
    site.email,
    proformaInfo.rccm && `RCCM : ${proformaInfo.rccm}`,
    proformaInfo.niu && `NIU : ${proformaInfo.niu}`,
  ].filter(Boolean)
  doc.text(em.map(clean), M, y + 11, { maxWidth: W / 2 - M - 6, lineHeightFactor: 1.35 })

  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...INK)
  doc.text(clean(client.name || 'Client'), W / 2 + 4, y + 6)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...GREY)
  const cl = [
    client.phone && `Téléphone : ${client.phone}`,
    client.email && `E-mail : ${client.email}`,
    `Procédure : ${serviceTitle}`,
    `Personnes concernées : ${adults} adulte(s)${children ? `, ${children} enfant(s)` : ''}`,
  ].filter(Boolean)
  doc.text(cl.map(clean), W / 2 + 4, y + 11, { maxWidth: W / 2 - M - 4, lineHeightFactor: 1.35 })

  y += 11 + Math.max(em.length, cl.length) * 4.3 + 3

  // Tableau des prestations
  const body = []
  estimate.groups.forEach((g) => {
    body.push([{ content: clean(g.title), colSpan: 4, styles: { fillColor: [238, 243, 255], textColor: BLUE, fontStyle: 'bold' } }])
    g.lines.forEach((l) => {
      body.push([
        clean(l.label),
        String(l.qty),
        l.cad != null ? clean(cad(l.cad)) : clean(xaf(l.xaf)),
        clean(xaf(estimate.toXaf(l))),
      ])
    })
    body.push([{ content: clean(`Sous-total : ${g.title}`), colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } }, { content: clean(xaf(g.total)), styles: { fontStyle: 'bold' } }])
  })

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [['Désignation', 'Qté', 'Prix unitaire', 'Montant (FCFA)'].map(clean)],
    body,
    theme: 'plain',
    styles: { font: 'helvetica', fontSize: 7.9, cellPadding: { top: 1.35, bottom: 1.35, left: 2.5, right: 2.5 }, textColor: INK, lineColor: [228, 232, 242], lineWidth: { bottom: 0.2 } },
    headStyles: { fillColor: BLUE, textColor: 255, fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 12, halign: 'center' }, 2: { cellWidth: 32, halign: 'right' }, 3: { cellWidth: 36, halign: 'right' } },
    didParseCell: (d) => { if (d.section === 'head' && d.column.index > 1) d.cell.styles.halign = 'right'; if (d.section === 'head' && d.column.index === 1) d.cell.styles.halign = 'center' },
  })

  y = doc.lastAutoTable.finalY + 3
  const FOOT = 13
  // Total
  doc.setFillColor(...RED); doc.roundedRect(W - M - 86, y, 86, 11, 2, 2, 'F')
  doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5)
  doc.text('TOTAL ESTIMÉ', W - M - 82, y + 7.2)
  doc.setFontSize(12); doc.text(clean(xaf(estimate.total)), W - M - 4, y + 7.4, { align: 'right' })
  doc.setTextColor(...GREY); doc.setFont('helvetica', 'normal'); doc.setFontSize(7)
  doc.text(clean(`Frais en dollars canadiens convertis au taux indicatif de 1 $ CA = ${CAD_TO_XAF} FCFA (${RATE_DATE}).`), M, y + 4.5, { maxWidth: W - 2 * M - 92 })
  y += 16

  // Bas de page en deux colonnes : remarques + conditions à gauche, signatures à droite
  const SIGW = 56
  const LW = W - 2 * M - SIGW - 6
  const lines = [
    ...(estimate.notes.length ? [['Remarques', estimate.notes]] : []),
    ['Conditions', [`Proforma valable ${proformaInfo.validiteJours} jours à compter de sa date d'émission.`, ...proformaInfo.conditions]],
  ]
  const fs = 7, lh = 3.1
  const blockH = lines.reduce((t, [, arr]) => t + 4.5 + arr.reduce((u, l) => u + doc.setFontSize(fs).splitTextToSize(clean(`- ${l}`), LW).length * lh + 0.6, 0) + 1.5, 0)
  const need = Math.max(blockH, 50)
  if (y + need > H - FOOT - 3) { doc.addPage(); y = 18 }

  let ly = y
  lines.forEach(([title, arr]) => {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...BLUE)
    doc.text(clean(title), M, ly); ly += 4
    doc.setFont('helvetica', 'normal'); doc.setFontSize(fs); doc.setTextColor(...INK)
    arr.forEach((t) => {
      const w = doc.splitTextToSize(clean(`- ${t}`), LW)
      doc.text(w, M, ly); ly += w.length * lh + 0.6
    })
    ly += 1.5
  })

  const sx = W - M - SIGW
  doc.setDrawColor(200, 206, 220); doc.setLineDashPattern([1, 1], 0)
  doc.roundedRect(sx, y - 3, SIGW, 23, 2, 2)
  doc.roundedRect(sx, y + 23, SIGW, 23, 2, 2)
  doc.setLineDashPattern([], 0)
  doc.setFontSize(7); doc.setTextColor(...GREY)
  doc.text(clean('Bon pour accord du client'), sx + SIGW / 2, y + 1.5, { align: 'center' })
  doc.text(clean('Cachet et signature du conseiller'), sx + SIGW / 2, y + 27.5, { align: 'center' })

  // Pied de page sur chaque page
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFillColor(...BLUE); doc.rect(0, H - FOOT, W, FOOT, 'F')
    doc.setFillColor(...RED); doc.rect(0, H - FOOT, W, 0.8, 'F')
    doc.setTextColor(255); doc.setFontSize(6.8); doc.setFont('helvetica', 'normal')
    doc.text(doc.splitTextToSize(clean(proformaInfo.mentions), W - 2 * M - 14), M, H - FOOT + 5.5)
    if (pages > 1) doc.text(`${i}/${pages}`, W - M, H - FOOT + 5.5, { align: 'right' })
  }

  doc.save(`Proforma-Vision-Consulting-${number}.pdf`)
  return number
}
