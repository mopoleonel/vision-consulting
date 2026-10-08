import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import ServiceDetail from './pages/ServiceDetail.jsx'
import Tcf from './pages/Tcf.jsx'
import Evaluation from './pages/Evaluation.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import Legal from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'
import ToolsHub from './pages/tools/ToolsHub.jsx'
import Eligibility from './pages/tools/Eligibility.jsx'
import Crs from './pages/tools/Crs.jsx'
import Nclc from './pages/tools/Nclc.jsx'
import Estimator from './pages/tools/Estimator.jsx'
import Staff from './pages/Staff.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="a-propos" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="formation-tcf" element={<Tcf />} />
        <Route path="evaluation" element={<Evaluation />} />
        <Route path="faq" element={<Faq />} />
        <Route path="outils" element={<ToolsHub />} />
        <Route path="outils/test-admissibilite" element={<Eligibility />} />
        <Route path="outils/calculateur-scg" element={<Crs />} />
        <Route path="outils/calculateur-nclc" element={<Nclc />} />
        <Route path="outils/estimateur-cout" element={<Estimator />} />
        <Route path="espace-conseiller" element={<Staff />} />
        <Route path="contact" element={<Contact />} />
        <Route path="mentions-legales" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
