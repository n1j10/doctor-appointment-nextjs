// import React from 'react'

// const test = () => {
//   return (
//     <div>
//                                   {/* Step 1: Date & Time */}
//                             {step === 1 && (
//                                 <>
//                                     <div className="p-6 border-b border-slate-100">
//                                         <h2 className="text-slate-900 text-xl font-bold">Step 2: Pick a Date & Time</h2>
//                                         <p className="text-slate-500 text-sm mt-1">Available slots for {selectedService?.name} ({selectedService?.duration} mins).</p>
//                                     </div>
//                                     <div className="p-6 flex flex-col gap-6">
//                                         {/* Dates */}
//                                         <div>
//                                             <h3 className="font-semibold text-slate-700 mb-3 text-sm">Select Date</h3>
//                                             {dateOptions.length === 0 ? (
//                                                 <p className="text-sm text-slate-500 italic">No available dates in the next 14 days.</p>
//                                             ) : (
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {dateOptions.map((d) => {
//                                                         const iso = d.toISOString().split('T')[0];
//                                                         const selected = selectedDate === iso;
//                                                         return (
//                                                             <button
//                                                                 key={iso}
//                                                                 onClick={() => { setSelectedDate(iso); setSelectedSlot(null); }}
//                                                                 className={`flex flex-col items-center rounded-xl px-4 py-3 border-2 min-w-[70px] transition-all ${selected ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'}`}
//                                                             >
//                                                                 <span className="text-xs font-medium">{DAYS[d.getDay()]}</span>
//                                                                 <span className="text-xl font-black leading-tight">{d.getDate()}</span>
//                                                                 <span className="text-xs">{d.toLocaleString('en', { month: 'short' })}</span>
//                                                             </button>
//                                                         );
//                                                     })}
//                                                 </div>
//                                             )}
//                                         </div>



//                                         {/* Time Slots */}
//                                         {selectedDate && (
//                                             <div>
//                                                 <h3 className="font-semibold text-slate-700 mb-3 text-sm">Select Time</h3>
//                                                 {timeSlots.length === 0 ? (
//                                                     <p className="text-sm text-slate-500 italic">No slots available for this day.</p>
//                                                 ) : (
//                                                     <div className="flex flex-wrap gap-2">
//                                                         {timeSlots.map((slot) => {
//                                                             const isSelected = selectedSlot?.start === slot.start;
//                                                             return (
//                                                                 <button
//                                                                     key={slot.start}
//                                                                     onClick={() => setSelectedSlot(slot)}
//                                                                     className={`rounded-lg px-4 py-2.5 border-2 text-sm font-semibold transition-all ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-primary/50'}`}
//                                                                 >
//                                                                     {slot.start}
//                                                                 </button>
//                                                             );
//                                                         })}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}

//                                         {/* Notes */}
//                                         <div>
//                                             <h3 className="font-semibold text-slate-700 mb-3 text-sm">Notes (optional)</h3>
//                                             <textarea
//                                                 value={notes}
//                                                 onChange={(e) => setNotes(e.target.value)}
//                                                 rows={3}
//                                                 placeholder="Any specific concerns or information for your provider..."
//                                                 className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-text-main placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="bg-slate-50 p-6 flex justify-between border-t border-slate-100">
//                                         <button onClick={() => setStep(0)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
//                                             <ArrowLeft className="w-4 h-4" /> Back
//                                         </button>
//                                         <button onClick={() => setStep(2)} disabled={!selectedDate || !selectedSlot} className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
//                                             Review Booking <ArrowRight className="w-4 h-4" />
//                                         </button>
//                                     </div>
//                                 </>
//                             )}

//     </div>
//   )
// }

// export default test
