"""Génère un contrat d'accompagnement PDF par procédure dans public/contrats/.

Données : src/config/contrats.json (montants, étapes, textes).
Usage   : python3 scripts/contrats.py   (nécessite reportlab et Pillow)
Le contrat Bourse QMA (public/contrats/Contrat-Bourse-QMA-Vision-Consulting.pdf) est un fichier fixe, non régénéré ici.
"""
import json, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.fonts import addMapping
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether
from PIL import Image as PILImage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = json.load(open(os.path.join(ROOT, 'src/config/contrats.json'), encoding='utf-8'))
LOGO = os.path.join(ROOT, 'src/assets/logo-full.png')
OUTDIR = os.path.join(ROOT, 'public/contrats')
FONTS = os.path.join(ROOT, 'scripts/fonts')
SYS = '/usr/share/fonts/truetype/crosextra/'

pdfmetrics.registerFont(TTFont('Outfit-Bold', os.path.join(FONTS, 'Outfit-Bold.ttf')))
pdfmetrics.registerFont(TTFont('Outfit-Medium', os.path.join(FONTS, 'Outfit-Medium.ttf')))
pdfmetrics.registerFont(TTFont('Carlito', SYS + 'Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', SYS + 'Carlito-Bold.ttf'))
addMapping('Carlito', 0, 0, 'Carlito'); addMapping('Carlito', 1, 0, 'Carlito-Bold')

BLUE = HexColor('#003197'); RED = HexColor('#DE1C1A'); INK = HexColor('#0C1530'); GREY = HexColor('#5E6A82')
LINE = HexColor('#D9DFEC'); PAPER = HexColor('#F6F7FB')
W, H = A4; M = 18 * mm

body = ParagraphStyle('body', fontName='Carlito', fontSize=9.6, leading=12.8, textColor=INK, spaceAfter=3, alignment=4)
lbl = ParagraphStyle('lbl', parent=body, alignment=0, spaceAfter=0)
kicker = ParagraphStyle('k', fontName='Outfit-Medium', fontSize=9.5, leading=12, textColor=RED, spaceAfter=2)
title = ParagraphStyle('t', fontName='Outfit-Bold', fontSize=19, leading=23, textColor=BLUE, spaceAfter=4)
art = ParagraphStyle('art', fontName='Outfit-Bold', fontSize=11.5, leading=14, textColor=BLUE, spaceBefore=6, spaceAfter=2, keepWithNext=1)
cell = ParagraphStyle('cell', parent=body, fontSize=9.5, leading=12.5, spaceAfter=0, alignment=0)
cellb = ParagraphStyle('cellb', parent=cell, fontName='Carlito-Bold')
cellw = ParagraphStyle('cellw', parent=cell, fontName='Outfit-Medium', textColor=white)
bul = ParagraphStyle('b', parent=body, leftIndent=12, firstLineIndent=-12, spaceAfter=1)

P = lambda t, st=body: Paragraph(t, st)
fcfa = lambda n: f"{n:,}".replace(',', ' ') + ' FCFA'


def money_words(n):
    words = {500000: 'cinq cent mille', 100000: 'cent mille'}
    return words.get(n, '')


def build(slug, p):
    rep, fonction, tel = DATA['representant'], DATA['fonction'], DATA['telephone']
    out = os.path.join(OUTDIR, f'Contrat-{slug}-Vision-Consulting.pdf')
    visa = 'etapes' not in p
    etapes = p['etapes'] if not visa else [
        ['À l’ouverture du dossier', p['tranches'][0]], [p['selection'], p['tranches'][1]], [p['visa'], p['tranches'][2]]]
    total = sum(x[1] for x in etapes)

    def on_page(c, doc):
        c.saveState()
        c.setFillColor(BLUE); c.rect(0, H - 4, W, 4, stroke=0, fill=1)
        c.setFillColor(RED); c.rect(W * 0.72, H - 4, W * 0.28, 4, stroke=0, fill=1)
        if doc.page > 1:
            c.setFont('Outfit-Medium', 8.5); c.setFillColor(GREY)
            c.drawString(M, H - 12 * mm, f'Vision Consulting  |  Contrat d’accompagnement : {p["titre"]}')
        c.setStrokeColor(LINE); c.setLineWidth(0.5); c.line(M, 15 * mm, W - M, 15 * mm)
        c.setFont('Carlito', 8.5); c.setFillColor(GREY)
        c.drawString(M, 10 * mm, f'Vision Consulting  •  Yaoundé  •  {tel}')
        c.drawRightString(W - M, 10 * mm, f'Page {doc.page}   •   Paraphe du Bénéficiaire : __________')
        c.restoreState()

    doc = BaseDocTemplate(out, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=17 * mm, bottomMargin=20 * mm,
                          title=f'Contrat d’accompagnement - {p["titre"]}', author='Vision Consulting')
    doc.addPageTemplates([PageTemplate(frames=[Frame(M, 20 * mm, W - 2 * M, H - 37 * mm)], onPage=on_page)])
    s = []
    w, h = PILImage.open(LOGO).size
    s += [Image(LOGO, width=46 * mm, height=46 * mm * h / w, hAlign='LEFT'), Spacer(1, 8),
          P('CONTRAT DE PRESTATION DE SERVICES', kicker), P(f'Accompagnement : {p["titre"]}', title), Spacer(1, 6)]

    fields = Table([[P(f'<font name="Carlito-Bold">{a}</font>', lbl), P('', lbl)] for a in
                    ['Nom et prénoms', 'Né(e) le / à', 'Pièce d’identité (n°)', 'Téléphone / WhatsApp']],
                   colWidths=[52 * mm, W - 2 * M - 52 * mm], rowHeights=[6.6 * mm] * 4)
    fields.setStyle(TableStyle([('LINEBELOW', (1, 0), (1, -1), 0.6, LINE), ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
                                ('LEFTPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 2)]))
    s += [P(f'<b>Vision Consulting</b>, cabinet de conseil en immigration situé à Yaoundé (Cameroun), représenté par <b>M. {rep}</b>, {fonction}, ci-après <b>« le Cabinet »</b>,'),
          P('<b>ET</b>'), fields, Spacer(1, 3),
          P('ci-après <b>« le Bénéficiaire »</b>. Il a été convenu ce qui suit.')]

    def article(n, t, paras, bl=None):
        s.append(P(f'<font color="#DE1C1A">Article {n}.</font> {t}', art))
        s.extend(P(x) for x in paras)
        if bl: s.extend(P(f'<font name="Carlito-Bold" color="#DE1C1A">•</font>&nbsp;&nbsp;{x}', bul) for x in bl)

    article(1, 'Objet', [f'Le Cabinet conseille et accompagne le Bénéficiaire dans sa procédure <b>« {p["titre"]} »</b> : {p["objet"]}.'])
    article(2, 'Aucune garantie de résultat', [
        f'Le Cabinet a une <b>obligation de moyens</b>. Il <b>ne garantit pas</b> l’issue de la procédure, ni la délivrance d’un document, d’un permis ou d’un visa, ni aucun délai : ces décisions appartiennent uniquement aux organismes concernés ({p["organismes"]}), dont le Cabinet n’est pas le représentant.'])

    words = money_words(total)
    article(3, 'Honoraires', [f'Les honoraires sont fixés forfaitairement à <b>{fcfa(total)}</b>{f" ({words} francs CFA)" if words else ""}, pour l’ensemble du dossier, payables en {len(etapes)} tranches :'])
    rows = [['Tranche', 'Montant', 'Exigible']] + [[f'{i + 1}{"re" if i == 0 else "e"}', fcfa(m), e] for i, (e, m) in enumerate(etapes)]
    data = [[P(c, cellw if i == 0 else (cellb if j == 0 else cell)) for j, c in enumerate(r)] for i, r in enumerate(rows)]
    t = Table(data, colWidths=[22 * mm, 30 * mm, W - 2 * M - 52 * mm])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), BLUE), ('LINEBELOW', (0, 0), (-1, -1), 0.5, LINE), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                           ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, PAPER]), ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    s += [t, Spacer(1, 4)]
    if visa:
        stop = 'Si la procédure s’arrête avant l’étape de la 2e tranche (refus, non-sélection ou abandon), seule la 1re tranche est due et le contrat prend fin. <b>La 3e tranche n’est due que si le visa est délivré.</b> '
    else:
        stop = 'Si la procédure s’arrête avant la réception du rapport (abandon du Bénéficiaire), seule la 1re tranche est due. '
    s.append(P(stop + f'Chaque paiement donne lieu à un <b>reçu signé</b>. Le Cabinet n’est pas responsable d’un paiement fait à une autre personne ou sur un autre numéro que le {tel}. '
               'Les frais officiels (gouvernement, organismes, biométrie, examens médicaux), les tests de langue, les traductions, les preuves de fonds, les billets d’avion et le logement restent à la charge du Bénéficiaire.'))

    article(4, 'Engagements du Bénéficiaire', ['Le Bénéficiaire s’engage à :'], [
        'donner des informations <b>exactes</b> et remettre uniquement des <b>documents authentiques</b> ;',
        'fournir les documents demandés dans les <b>5 jours</b> et respecter les dates limites des organismes ;',
        'relire et valider chaque formulaire avant son dépôt ; les comptes en ligne sont ouverts à son nom et il reste <b>seul responsable des informations déclarées</b> ;',
        'rester joignable et payer aux échéances prévues.'])
    article(5, 'Responsabilité', [
        'Le Cabinet n’est pas responsable d’un refus ou d’un retard des organismes, d’un changement des règles ou des frais officiels, d’informations fausses ou tardives du Bénéficiaire, ni d’une panne des plateformes officielles. Si sa responsabilité était retenue pour une faute prouvée, elle serait <b>limitée aux honoraires perçus</b>.',
        'Toute <b>fraude ou faux document</b> entraîne la fin immédiate du contrat sans remboursement ; le Bénéficiaire en supporte seul les conséquences.'])
    article(6, 'Remboursement et désistement', [
        'Les sommes versées <b>restent acquises</b> au Cabinet (refus d’un organisme, désistement ou faute du Bénéficiaire). Seule exception : si le Cabinet n’exécute pas, de son fait, une prestation prévue, la tranche correspondante est remboursée. Le Bénéficiaire peut arrêter à tout moment par écrit ; aucune tranche future n’est alors due.'])
    article(7, 'Confidentialité et preuve', [
        'Les informations du Bénéficiaire restent confidentielles et ne sont transmises qu’aux organismes concernés. Les échanges WhatsApp, SMS et e-mail ont <b>valeur de preuve</b> entre les parties.'])
    article(8, 'Litiges', [
        'Le contrat est soumis au droit camerounais. En cas de désaccord, le Bénéficiaire adresse d’abord une <b>réclamation écrite</b> au Cabinet, qui répond sous 15 jours. Aucune action en justice ni publication sur les réseaux sociaux avant <b>30 jours</b> après cette réclamation. À défaut d’accord, les juridictions de Yaoundé sont compétentes.'])

    s += [Spacer(1, 4),
          P('Le Bénéficiaire remplit lui-même ses informations ci-dessus, paraphe chaque page et signe. Il reconnaît avoir lu et compris le présent contrat, établi en deux exemplaires originaux.'),
          P('Fait à Yaoundé, le ____ / ____ / ________'), Spacer(1, 4)]
    sig = Table([[P(f'<font name="Outfit-Medium" color="#003197">Pour Vision Consulting</font><br/><b>{rep}</b>, {fonction}<br/>Signature et cachet'),
                  P('<font name="Outfit-Medium" color="#003197">Le Bénéficiaire</font><br/>Nom, mention manuscrite « <b>Lu et approuvé</b> »<br/>et signature')],
                 ['', '']], colWidths=[(W - 2 * M) / 2 - 4 * mm] * 2, rowHeights=[None, 30 * mm])
    sig.setStyle(TableStyle([('BOX', (0, 1), (0, 1), 0.6, LINE), ('BOX', (1, 1), (1, 1), 0.6, LINE), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0)]))
    s.append(KeepTogether([sig]))
    doc.build(s)
    return out


if __name__ == '__main__':
    os.makedirs(OUTDIR, exist_ok=True)
    for slug, p in DATA['procedures'].items():
        print(build(slug, p))
