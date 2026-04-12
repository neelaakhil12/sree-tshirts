import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Printer, Download, MapPin, Phone, Mail, User, FileText, Calendar, IndianRupee } from 'lucide-react'
import { useData } from '../../context/DataContext'

const AdminInvoice = () => {
  const { products } = useData()
  const [invoiceItems, setInvoiceItems] = useState([])
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  })
  const [invoiceNumber, setInvoiceNumber] = useState(`WM-${Date.now().toString().slice(-6)}`)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const [selectedProductId, setSelectedProductId] = useState('')

  const addItem = () => {
    const product = products.find(p => p.id === Number(selectedProductId))
    if (product) {
      setInvoiceItems([...invoiceItems, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1,
        total: product.price
      }])
      setSelectedProductId('')
    }
  }

  const updateQuantity = (index, qty) => {
    const newItems = [...invoiceItems]
    newItems[index].quantity = Math.max(1, qty)
    newItems[index].total = newItems[index].price * newItems[index].quantity
    setInvoiceItems(newItems)
  }

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index))
  }

  const calculateSubtotal = () => invoiceItems.reduce((sum, item) => sum + item.total, 0)
  const gst = calculateSubtotal() * 0.05 // Assuming 5% GST
  const grandTotal = calculateSubtotal() + gst

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="pb-32 space-y-8 no-print">
       {/* UI Control Panel */}
       <div className="bg-white border border-gray-100 p-8 space-y-10">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
             <div className="flex items-center space-x-3">
                <FileText className="text-accent" />
                <h2 className="text-xl font-black uppercase tracking-tight">Invoice Generator</h2>
             </div>
             <button 
               onClick={handlePrint}
               className="bg-black text-white px-8 py-3 font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-accent transition-all"
             >
                <Printer size={16} />
                <span>GENERATE & PRINT</span>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {/* Customer Details */}
             <div className="space-y-6">
                <h3 className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Customer Name" 
                        className="w-full bg-gray-50 border-none p-4 pl-12 text-sm font-bold"
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                      />
                   </div>
                   <div className="relative">
                      <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="w-full bg-gray-50 border-none p-4 pl-12 text-sm font-bold"
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                      />
                   </div>
                </div>
                <div className="relative">
                   <MapPin size={14} className="absolute left-4 top-4 text-gray-400" />
                   <textarea 
                     placeholder="Shipping Address" 
                     rows="3" 
                     className="w-full bg-gray-50 border-none p-4 pl-12 text-sm font-bold resize-none"
                     value={customer.address}
                     onChange={(e) => setCustomer({...customer, address: e.target.value})}
                   ></textarea>
                </div>
             </div>

             {/* Item Selection */}
             <div className="space-y-6">
                <h3 className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Add Products</h3>
                <div className="flex gap-4">
                   <select 
                     className="flex-1 bg-gray-50 border-none p-4 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-accent"
                     value={selectedProductId}
                     onChange={(e) => setSelectedProductId(e.target.value)}
                   >
                      <option value="">Select a product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                      ))}
                   </select>
                   <button 
                     onClick={addItem}
                     className="bg-black text-white px-6 py-4 font-black text-xs uppercase hover:bg-accent transition-all"
                   >
                      <Plus size={18} />
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* Invoice Preview (Standard A4 Feel) */}
       <div className="bg-white border border-gray-100 p-12 md:p-20 shadow-2xl mx-auto max-w-[900px] print:shadow-none print:p-0 print:m-0 print:max-w-none" id="invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-10 border-b-2 border-black pb-10">
             <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tighter">
                   WEAR <span className="text-accent underline decoration-black">MINGLE</span>
                </h1>
                <div className="text-[10px] font-bold text-gray-500 space-y-1 uppercase tracking-tight">
                   <p>SBI Colony, Nandyal – 518501</p>
                   <p>Bangalore – 560001</p>
                   <p>+91 9398292014 | wearmingle@gmail.com</p>
                </div>
             </div>
             <div className="text-right space-y-2">
                <h2 className="text-4xl font-black text-gray-200 uppercase tracking-tighter">INVOICE</h2>
                <div className="text-[10px] font-black uppercase space-y-1">
                   <p>Invoice #: <span className="text-black">{invoiceNumber}</span></p>
                   <p>Date: <span className="text-black">{date}</span></p>
                </div>
             </div>
          </div>

          {/* Customer Dest */}
          <div className="py-12 flex justify-between">
             <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bill To:</h3>
                <div className="space-y-1">
                   <p className="font-black text-lg">{customer.name || 'CASH CUSTOMER'}</p>
                   <p className="text-sm font-medium text-gray-500 max-w-xs">{customer.address || 'Point of Sale'}</p>
                   <p className="text-sm font-bold text-black">{customer.phone}</p>
                </div>
             </div>
          </div>

          {/* Table */}
          <div className="mt-8 border border-black overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-black text-white text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6 py-4">Item Description</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Price</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4 text-right no-print"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {invoiceItems.map((item, index) => (
                     <tr key={index} className="text-sm font-bold">
                        <td className="px-6 py-4 uppercase">{item.name}</td>
                        <td className="px-6 py-4 text-center">
                           <div className="flex items-center justify-center space-x-3">
                              <button onClick={() => updateQuantity(index, item.quantity - 1)} className="no-print w-6 h-6 border flex items-center justify-center hover:bg-gray-100">-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(index, item.quantity + 1)} className="no-print w-6 h-6 border flex items-center justify-center hover:bg-gray-100">+</button>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">₹{item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap underline decoration-accent font-black">₹{item.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right no-print">
                           <button onClick={() => removeItem(index)} className="text-red-500 p-1 hover:bg-red-50 transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </td>
                     </tr>
                   ))}
                   {invoiceItems.length === 0 && (
                     <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 uppercase tracking-widest text-xs font-black">
                           No items added to invoice
                        </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>

          {/* Totals */}
          <div className="mt-12 flex justify-end">
             <div className="w-full sm:w-64 space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                   <span>Subtotal</span>
                   <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase text-gray-500">
                   <span>GST (5%)</span>
                   <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black bg-black text-white p-4">
                   <span className="tracking-tighter uppercase">Total</span>
                   <span>₹{grandTotal.toFixed(2)}</span>
                </div>
             </div>
          </div>

          <div className="mt-24 border-t-2 border-gray-100 pt-10 text-center">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Thank you for choosing Wear Mingle</p>
             <p className="text-[9px] text-gray-300 mt-1 italic">This is a computer generated invoice</p>
          </div>
       </div>

       <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice, #invoice * {
              visibility: visible;
            }
            #invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
          }
       ` }} />
    </div>
  )
}

export default AdminInvoice
