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
  MapPin,
  Calendar
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import AdminSidebar from '../../components/admin/AdminSidebar'

const InvoiceGenerator = () => {
  const { products } = useData()
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '', date: new Date().toISOString().split('T')[0] })
  const [selectedItems, setSelectedItems] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const addItem = (productId) => {
    const product = products.find(p => p.id === parseInt(productId))
    if (product) {
      setSelectedItems([...selectedItems, { ...product, quantity: 1, total: product.price }])
    }
  }

  const updateQuantity = (index, qty) => {
    const updated = [...selectedItems]
    updated[index].quantity = parseInt(qty) || 1
    updated[index].total = updated[index].quantity * updated[index].price
    setSelectedItems(updated)
  }

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const subtotal = selectedItems.reduce((acc, item) => acc + item.total, 0)
  const tax = subtotal * 0.05 // 5% GST example
  const total = subtotal + tax

  const generatePDF = () => {
    setIsGenerating(true)
    const doc = new jsPDF()

    // Header Branding
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('WEAR MINGLE', 20, 25)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Modern Fashion for Men, Women & Kids', 20, 32)
    
    // Invoice Label
    doc.setFontSize(20)
    doc.text('INVOICE', 160, 25)
    doc.setFontSize(9)
    doc.text(`No: #WM-${Math.floor(Math.random() * 90000) + 10000}`, 160, 32)

    // Customer Info
    doc.line(20, 45, 190, 45)
    doc.setFont('helvetica', 'bold')
    doc.text('BILL TO:', 20, 55)
    doc.setFont('helvetica', 'normal')
    doc.text(customer.name.toUpperCase() || 'WALK-IN CUSTOMER', 20, 62)
    doc.text(customer.phone || 'N/A', 20, 68)
    doc.text(customer.address || 'N/A', 20, 74)

    doc.setFont('helvetica', 'bold')
    doc.text('DATE:', 150, 55)
    doc.setFont('helvetica', 'normal')
    doc.text(customer.date, 165, 55)

    // Table
    const tableData = selectedItems.map(item => [
      item.name.toUpperCase(),
      item.quantity.toString(),
      item.price.toFixed(2),
      item.total.toFixed(2)
    ])

    doc.autoTable({
      startY: 85,
      head: [['PRODUCT DESCRIPTION', 'QTY', 'UNIT PRICE', 'AMOUNT']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillGray: 200, textColor: 0, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 100 } }
    })

    // Footer Totals
    const finalY = doc.lastAutoTable.finalY + 10
    doc.setFont('helvetica', 'bold')
    doc.text(`SUBTOTAL:`, 140, finalY)
    doc.setFont('helvetica', 'normal')
    doc.text(`${subtotal.toFixed(2)}`, 175, finalY)

    doc.setFont('helvetica', 'bold')
    doc.text(`GST (5%):`, 140, finalY + 8)
    doc.setFont('helvetica', 'normal')
    doc.text(`${tax.toFixed(2)}`, 175, finalY + 8)

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`TOTAL AMOUNT:`, 110, finalY + 20)
    doc.text(`${total.toFixed(2)}`, 175, finalY + 20)

    // Footer Note
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('Thank you for shopping with Wear Mingle! Visit again.', 105, 270, { align: 'center' })

    doc.save(`Invoice_${customer.name || 'Order'}.pdf`)
    setIsGenerating(false)
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
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping Address</label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-gray-300" size={16} />
                          <textarea 
                            className="w-full bg-gray-50 border-none px-12 py-3 text-xs font-bold outline-none focus:bg-white focus:ring-1 ring-black/5 min-h-[80px]" 
                            placeholder="Complete Address"
                            value={customer.address}
                            onChange={(e) => setCustomer({...customer, address: e.target.value})}
                          ></textarea>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 p-10 space-y-8 shadow-sm">
                 <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Order Items</h3>
                    <select 
                      onChange={(e) => addItem(e.target.value)}
                      value=""
                      className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                    >
                       <option value="" disabled>+ Add Product</option>
                       {products.map(p => (
                         <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                       ))}
                    </select>
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
                              <div>
                                 <h4 className="text-[11px] font-black uppercase tracking-tight">{item.name}</h4>
                                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">₹{item.price} each</p>
                              </div>
                           </div>
                           <div className="flex items-center space-x-6">
                              <input 
                                type="number" 
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(index, e.target.value)}
                                className="w-16 bg-white border border-gray-200 px-3 py-1 text-xs font-black outline-none"
                              />
                              <p className="w-20 text-right text-xs font-black uppercase tracking-widest">₹{item.total.toFixed(2)}</p>
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
                       <span className="text-gray-400">GST (5%)</span>
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
                    {isGenerating ? <TrendingUp className="animate-spin" size={20} /> : <Download size={20} />}
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
