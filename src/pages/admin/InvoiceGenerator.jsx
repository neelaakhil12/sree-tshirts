import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  Loader2
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import AdminSidebar from '../../components/admin/AdminSidebar'

const InvoiceGenerator = () => {
  const { products } = useData()
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', date: new Date().toISOString().split('T')[0] })
  const [selectedItems, setSelectedItems] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const addCustomItem = () => {
    setSelectedItems([...selectedItems, { name: '', price: '', quantity: 1, color: '', details: '', total: 0 }])
  }

  const updateItemField = (index, field, value) => {
    const updated = [...selectedItems]
    if (field === 'price' || field === 'quantity') {
      updated[index][field] = value
      const parsedQty = parseFloat(updated[index].quantity) || 0
      const parsedPrice = parseFloat(updated[index].price) || 0
      updated[index].total = parsedQty * parsedPrice
    } else {
      updated[index][field] = value
    }
    setSelectedItems(updated)
  }

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const subtotal = selectedItems.reduce((acc, item) => acc + item.total, 0)
  const tax = subtotal * 0.03 // 3% GST
  const total = subtotal + tax

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
        const doc = new jsPDF()

        // Fetch Logo
        const loadLogo = () => new Promise((resolve) => {
            const img = new Image()
            img.src = '/images/logo.png'
            img.onload = () => resolve(img)
            img.onerror = () => resolve(null)
        })

        const logoImg = await loadLogo()
        
        // Render Top Header
        if (logoImg) {
            // Check aspect ratio to maintain shape roughly
            // Assuming square or slight rectangle based on logo
            doc.addImage(logoImg, 'PNG', 15, 10, 35, 35)
        } else {
            doc.setFontSize(20)
            doc.setFont('helvetica', 'bold')
            doc.text('Wear Mingle', 15, 25)
        }

        // Right side address
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Wear Mingle', 195, 15, { align: 'right' })
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text('29/207-F1-8-4, SBI Colony, Revenue Ward -29', 195, 21, { align: 'right' })
        doc.text('Nandyal – 518501', 195, 26, { align: 'right' })
        doc.text('Phone: +91 9398292014', 195, 31, { align: 'right' })
        doc.text('Email: wearmingle@gmail.com', 195, 36, { align: 'right' })
        doc.setFont('helvetica', 'bold')
        doc.text('GST No: 29AAVHA4998Q1ZV', 195, 41, { align: 'right' })

        // Divider
        doc.setLineWidth(0.5)
        doc.line(15, 48, 195, 48)

        // Invoice Title
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('TAX INVOICE', 105, 58, { align: 'center' })

        // Customer Info
        doc.setFontSize(10)
        doc.text('Bill To:', 15, 70)
        doc.setFont('helvetica', 'normal')
        doc.text(`M/S: ${customer.name || 'Walk-in'}`, 15, 76)
        doc.text(`Phone: ${customer.phone || 'N/A'}`, 15, 81)
        doc.text(`Email: ${customer.email || 'N/A'}`, 15, 86)

        // Order Info
        doc.setFont('helvetica', 'bold')
        doc.text('Order Details:', 120, 70)
        doc.setFont('helvetica', 'normal')
        doc.text(`Invoice No: TTHSO-${Math.floor(Math.random() * 9000) + 1000}`, 120, 76)
        doc.text(`Date: ${customer.date}`, 120, 81)
        doc.text(`Agency: Direct`, 120, 86)

        // Table
        const tableData = selectedItems.map((item, idx) => {
          const priceVal = parseFloat(item.price) || 0;
          const totalVal = parseFloat(item.total) || 0;
          return [
            (idx + 1).toString(),
            (item.name || 'Custom Item').substring(0, 30),
            item.color || 'N/A',
            item.details || 'N/A',
            (item.quantity || 0).toString(),
            priceVal.toFixed(2),
            totalVal.toFixed(2)
          ];
        })

        autoTable(doc, {
          startY: 95,
          head: [['Sr. No.', 'Design / Item', 'Color', 'Details', 'Qty', 'Rate', 'Amount']],
          body: tableData,
          theme: 'grid',
          styles: { font: 'helvetica', fontSize: 9, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.1 },
          headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
          columnStyles: { 
            0: { cellWidth: 15, halign: 'center' }, 
            1: { cellWidth: 50 },
            4: { halign: 'center', cellWidth: 15 },
            5: { halign: 'right' },
            6: { halign: 'right' }
          }
        })

        const finalY = doc.lastAutoTable.finalY + 10
        const tableWidth = 195 // right margin

        // Totals Block on the right
        doc.setFont('helvetica', 'normal')
        doc.text(`Subtotal`, 150, finalY)
        doc.text(`Rs ${subtotal.toFixed(2)}`, tableWidth, finalY, { align: 'right' })

        doc.text(`GST (3%)`, 150, finalY + 6)
        doc.text(`Rs ${tax.toFixed(2)}`, tableWidth, finalY + 6, { align: 'right' })

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text(`Grand Total`, 150, finalY + 16)
        doc.text(`Rs ${total.toFixed(2)}`, tableWidth, finalY + 16, { align: 'right' })

        // Total Qty left 
        const totalQty = selectedItems.reduce((acc, item) => acc + (parseFloat(item.quantity) || 0), 0)
        doc.setFontSize(10)
        doc.text(`Total Quantity: ${totalQty}`, 15, finalY)

        // Footer Block
        const footY = doc.internal.pageSize.getHeight() - 25
        doc.setFont('helvetica', 'bold')
        doc.text('Scan and Pay', 15, footY)
        doc.setFont('helvetica', 'normal')
        doc.text('UPI id: wearmingle@upi', 15, footY + 5)
        doc.text('Created by : Admin', 15, footY + 10)

        doc.setFontSize(8)
        doc.setFont('helvetica', 'italic')
        doc.text('Thank you for your order. We appreciate the opportunity and looking forward to a long term relationship.', 105, footY + 18, { align: 'center' })

        doc.save(`Invoice_${customer.name || 'Order'}.pdf`)
    } catch (error) {
        console.error("PDF Generation Error: ", error)
        alert("Failed to generate PDF. Check the console for details: " + error.message)
    } finally {
        setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-12">
        <div className="mb-12">
           <div className="flex items-center text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4 space-x-2">
              <Link to="/admin/dashboard" className="hover:text-black">Dashboard</Link>
              <ChevronRight size={10} />
              <span className="text-black">Invoice Generator</span>
           </div>
           <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase">Generate Bill</h2>
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">Create professional PDFs for orders</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Left: Customer Info & Product Selection */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-gray-100 p-10 space-y-8 shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Customer Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">FullName</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input 
                            type="text" 
                            className="w-full bg-gray-50 border-none px-12 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 ring-black/5" 
                            placeholder="Customer Name"
                            value={customer.name}
                            onChange={(e) => setCustomer({...customer, name: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                       <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input 
                            type="text" 
                            className="w-full bg-gray-50 border-none px-12 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 ring-black/5" 
                            placeholder="Phone Number"
                            value={customer.phone}
                            onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input 
                            type="email" 
                            className="w-full bg-gray-50 border-none px-12 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 ring-black/5" 
                            placeholder="Customer Email"
                            value={customer.email}
                            onChange={(e) => setCustomer({...customer, email: e.target.value})}
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 p-10 space-y-8 shadow-sm">
                 <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Order Items</h3>
                    <button 
                      onClick={addCustomItem} 
                      className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none hover:bg-gray-800 transition-colors"
                    >
                      + ADD PRODUCT
                    </button>
                 </div>

                 {selectedItems.length === 0 ? (
                   <div className="py-12 text-center">
                      <Package className="mx-auto text-gray-100 mb-4" size={48} />
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No items added to invoice yet</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      {selectedItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-4 group">
                           <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-white p-1">
                                 <img src={item.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                              </div>
                              <div className="flex-1 min-w-[150px]">
                                 <input 
                                   type="text"
                                   placeholder="Product Name"
                                   value={item.name}
                                   onChange={(e) => updateItemField(index, 'name', e.target.value)}
                                   className="w-full bg-transparent border-b border-dashed border-gray-300 px-0 py-1 mb-1 text-[11px] font-black uppercase tracking-tight outline-none focus:border-black"
                                 />
                                 <div className="flex items-center space-x-1">
                                   <span className="text-[9px] text-gray-400 font-bold uppercase">₹</span>
                                   <input 
                                     type="number"
                                     placeholder="Price"
                                     value={item.price}
                                     onChange={(e) => updateItemField(index, 'price', e.target.value)}
                                     className="w-20 bg-transparent border-b border-dashed border-gray-300 px-1 py-0.5 text-[9px] font-bold outline-none focus:border-black"
                                   />
                                   <span className="text-[9px] text-gray-400 font-bold uppercase">each</span>
                                 </div>
                              </div>
                              <div className="flex flex-col space-y-2 col-span-2 md:col-span-1 border-l border-gray-200 pl-4 ml-4">
                                 <input 
                                   type="text" 
                                   placeholder="Color"
                                   value={item.color}
                                   onChange={(e) => updateItemField(index, 'color', e.target.value)}
                                   className="w-full bg-white border border-gray-200 px-3 py-1 text-xs font-bold outline-none"
                                 />
                                 <input 
                                   type="text" 
                                   placeholder="Details (e.g. XL, Cotton)"
                                   value={item.details}
                                   onChange={(e) => updateItemField(index, 'details', e.target.value)}
                                   className="w-full bg-white border border-gray-200 px-3 py-1 text-xs font-bold outline-none"
                                 />
                              </div>
                           </div>
                           <div className="flex items-center space-x-6 mt-4 md:mt-0">
                              <input 
                                type="number" 
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItemField(index, 'quantity', e.target.value)}
                                className="w-16 bg-white border border-gray-200 px-3 py-1 text-xs font-black outline-none"
                              />
                              <p className="w-20 text-right text-xs font-black uppercase tracking-widest">₹{(parseFloat(item.total) || 0).toFixed(2)}</p>
                              <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

           {/* Right: Summary & Export */}
           <div className="space-y-8">
              <div className="bg-black text-white p-10 space-y-10 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                 <h3 className="text-xs font-black uppercase tracking-widest border-b border-white/10 pb-4">Bill Summary</h3>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase">
                       <span className="text-gray-400">Subtotal</span>
                       <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase">
                       <span className="text-gray-400">GST (3%)</span>
                       <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Grant Total</p>
                          <span className="text-3xl font-black tracking-tighter">₹{total.toFixed(2)}</span>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={generatePDF}
                   disabled={selectedItems.length === 0 || isGenerating}
                   className="w-full bg-white text-black h-16 font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center space-x-3 hover:bg-accent hover:text-white transition-all disabled:opacity-30 shadow-xl"
                 >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    <span>{isGenerating ? 'Generating...' : 'Export Invoice PDF'}</span>
                 </button>
              </div>

              <div className="bg-white border border-gray-100 p-8 text-center space-y-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Calendar size={20} className="text-gray-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Billing Date</p>
                    <p className="text-xs font-black uppercase">{customer.date}</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}

export default InvoiceGenerator
