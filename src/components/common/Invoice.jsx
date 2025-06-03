// import React from "react";

// const Invoice = () => {
//   return (
//     <div className="max-w-3xl mx-auto p-4 border border-black text-[12px] font-sans">
//       {/* Header */}
//       <div className="text-center font-bold text-[14px] border-b border-black pb-1">
//         !! Shree Ganeshay Namah !!
//       </div>
//       <div className="flex items-center justify-between border-b border-black pb-2 mt-1">
//         <img
//           src="https://i.ibb.co/Kw5h5vP/lord-ganesh.png"
//           alt="Ganesh"
//           className="w-16 h-16"
//         />
//         <div className="text-center w-full">
//           <h1 className="text-[20px] font-bold underline">APS FASHION</h1>
//           <p className="text-[12px] font-semibold">
//             110, 2ND FLOOR, BHAGYODAY IND., AJMATA ROAD, MAGOB, SURAT
//           </p>
//           <p className="font-bold">GSTIN NO : 24ACVPH3278C1ZJ</p>
//         </div>
//         <div className="text-right text-[10px]">
//           <p>Mo: 92656 94036</p>
//           <p>88663 04016</p>
//         </div>
//       </div>

//       {/* Invoice Info */}
//       <div className="border-b border-black mt-1 pb-1 text-[12px]">
//         <p className="font-bold underline text-center">Tax Invoice</p>
//         <div className="flex justify-between mt-2">
//           <div>
//             <p className="font-semibold">Details of Receiver (Billed to)</p>
//             <p className="font-bold">M/s : YOYO FASHION INDIA PVT LTD</p>
//             <p className="text-[11px]">
//               Add : 7090-11,THARI TEXTILE WORLD, PARAVAT MAGOB,
//             </p>
//           </div>
//           <div className="text-[11px]">
//             <p>
//               <span className="font-semibold">Invoice No:</span> 2
//             </p>
//             <p>
//               <span className="font-semibold">Invoice Date:</span> 25/09/2024
//             </p>
//             <p>
//               <span className="font-semibold">Broker Name:</span> SALE PARTY
//             </p>
//           </div>
//         </div>
//         <p className="mt-1">
//           <span className="font-semibold">GSTIN No:</span> 24AABCY3665J122
//         </p>
//       </div>

//       {/* Table */}
//       <table className="w-full border border-black mt-2 text-[11px]">
//         <thead>
//           <tr className="border-b border-black text-left">
//             <th className="border-r border-black px-1">Sr.</th>
//             <th className="border-r border-black px-1">Product Name</th>
//             <th className="border-r border-black px-1">D No</th>
//             <th className="border-r border-black px-1">Party Chln</th>
//             <th className="border-r border-black px-1">HSN</th>
//             <th className="border-r border-black px-1">Pcs</th>
//             <th className="border-r border-black px-1">Rate</th>
//             <th className="px-1">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {[
//             ["1", "DUPATTA", "8543", "77", "998", "184.300", "100", "18300.00"],
//             ["2", "DUPATTA", "8570", "78", "998", "184.300", "100", "18300.00"],
//             ["3", "DUPATTA", "8571", "79", "998", "184.300", "100", "18300.00"],
//             ["4", "DUPATTA", "8624", "80", "998", "370.870", "100", "37087.00"],
//           ].map((row, i) => (
//             <tr key={i} className="border-t border-black">
//               {row.map((col, j) => (
//                 <td
//                   key={j}
//                   className={`border-r border-black px-1 ${
//                     j === row.length - 1 ? "border-r-0" : ""
//                   }`}
//                 >
//                   {col}
//                 </td>
//               ))}
//             </tr>
//           ))}
//           {/* Sub Total Row */}
//           <tr className="border-t border-black font-bold">
//             <td colSpan={7} className="text-right px-1 border-r border-black">
//               Sub Total :
//             </td>
//             <td className="px-1">92377.00</td>
//           </tr>
//           {/* Discount */}
//           <tr>
//             <td colSpan={7} className="text-right px-1 border-r border-black">
//               Discount 7%
//             </td>
//             <td className="px-1">6466.39</td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Tax, Total */}
//       <div className="mt-2 text-[11px]">
//         <div className="flex justify-end">
//           <div className="w-1/2">
//             <div className="flex justify-between">
//               <p>Taxable Amount</p>
//               <p>85910.61</p>
//             </div>
//             <div className="flex justify-between">
//               <p>CGST 2.5%</p>
//               <p>2147.77</p>
//             </div>
//             <div className="flex justify-between">
//               <p>SGST 2.5%</p>
//               <p>2147.77</p>
//             </div>
//             <div className="flex justify-between">
//               <p>Round off</p>
//               <p>-0.15</p>
//             </div>
//           </div>
//         </div>
//         <div className="text-right mt-2 text-[13px] font-bold">
//           Net Amount: <span className="text-[15px]">90206.00</span>
//         </div>
//         <p className="text-right font-semibold text-[10px]">TDS Amount : ______</p>
//       </div>

//       {/* Bank Details */}
//       <div className="mt-2 text-[10px]">
//         <p className="font-bold underline">Bank Details :</p>
//         <p>Bank Name :</p>
//         <p>Branch Name :</p>
//         <p>IFSC Code :</p>
//         <p>A/C No. :</p>
//       </div>

//       {/* Amount in words */}
//       <p className="mt-2 font-semibold">Bill Amt. in words : Ninety Thousand Two Hundred Six Only</p>

//       {/* Terms */}
//       <div className="mt-2 text-[10px] leading-tight">
//         <p className="font-bold underline">Terms & Condition :</p>
//         <ol className="list-decimal ml-4">
//           <li>Subject to Surat Jurisdiction.</li>
//           <li>
//             Kindly check goods before your account and at your risk & responsibility.
//           </li>
//           <li>
//             Any complaint regarding goods should be reported in written within 2 days.
//           </li>
//           <li>Late payment interest 24% p.a. will be charged.</li>
//         </ol>
//       </div>

//       {/* Signatures */}
//       <div className="mt-4 flex justify-between text-[11px]">
//         <div>
//           <p>A/c: ________ Be: ________ Cc: ________ Dt: ___/___/_____</p>
//         </div>
//         <div className="text-right">
//           <p>For, APS FASHION</p>
//           <p className="italic mt-6">(Authorised Signatory)</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;


import React from "react";

const Invoice = () => {
    return (
        <div className="w-[75%] mx-auto p-[16px]  border border-gray-200 font-[Arial] text-[12px] text-black">
            {/* Header */}
            <div className="text-center text-[12px] pb-1">
                !! Shree Ganeshay Namah !!
            </div>

            {/* BODY */}
            <div className="border border-black mx-3">

                <div className="border border-black px-2 py-1">
                    <div className="flex justify-between items-start">
                        {/* Left: Ganesh image */}
                        <img
                            src="/assets/images/invoice_img.png"
                            alt="Ganesh"
                            className="w-40 h-auto"
                        />

                        {/* Center: Text block */}
                        <div className="flex-1 text-center mt-2">
                            <div className="text-[48px] font-extrabold italic">APS FASHION</div>
                            <div className="text-[18px] leading-tight mt-1">
                                110,2ND FLOOR,BHAGYODAY IND,AAIMATA ROAD
                                MAGOB SURAT
                            </div>
                            <div className="text-[20px] font-extrabold mt-2">
                                GSTIN NO : <span className="tracking-wide">24ACVPH3278C1ZJ</span>
                            </div>
                        </div>

                        {/* Right: Contact */}
                        <div className="text-right text-[14px] leading-tight mt-1">
                            <div>Mo :- 92656 94036</div>
                            <div>88663 04016</div>
                        </div>
                    </div>
                </div>

                {/* Receiver & Invoice Details */}
                <div className="border border-black">
                    {/* Top title row */}
                    <div className="border-b border-black text-center font-bold text-[20px] py-1">
                        Tax Invoice
                    </div>

                    {/* Main content row */}
                    <div className="flex border-b border-black text-[16px]">
                        {/* Left section: Billed to */}
                        <div className="w-2/3 border-r border-black p-2">
                            <div className="font-bold">Details of Receiver (Billed to)</div>
                            <div className="font-bold mt-1">
                                <span className="font-bold">M/s. :</span> YOYO FASHION INDIA PVT LTD
                            </div>
                            <div className="text-sm mt-1 ml-[38px] leading-tight">
                                <div>7009-10.7TH,RAJ TEXTILE WORLD</div>
                                <div>PARAVAT MAGOB,</div>
                            </div>
                            <div className="mt-5 font-bold text-[14px]">
                                GSTIN No : <span className="font-normal">24AABCY3666J1Z2</span>
                            </div>
                        </div>

                        {/* Right section: Invoice info */}
                        <div className="w-1/3 p-2 text-[16px]">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">Invoice No :</span>
                                <span>2</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold">Invoice Date :</span>
                                <span>25/09/2024</span>
                            </div>
                            <div className="flex justify-between border-t border-black pt-2">
                                <span className="font-bold">Broker Name :</span>
                                <span>SALE PARTY</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Table */}
                <table className="w-full text-[13px] border border-black border-collapse mt-2 table-fixed">
                    <thead>
                        <tr>
                            <th className="border border-black w-[30px]">Sr.</th>
                            <th className="border border-black w-[160px]">Product Name</th>
                            <th className="border border-black w-[60px]">D No</th>
                            <th className="border border-black w-[70px]">Party Chln No</th>
                            <th className="border border-black w-[60px]">HSN</th>
                            <th className="border border-black w-[80px]">Pcs</th>
                            <th className="border border-black w-[60px]">Rate</th>
                            <th className="border border-black w-[90px]">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ["1", "DUPATTA", "8543", "77", "9988", "184.300", "100.00", "18430.00"],
                            ["2", "DUPATTA", "8570", "78", "9988", "184.300", "100.00", "18430.00"],
                            ["3", "DUPATTA", "8571", "79", "9988", "184.300", "100.00", "18430.00"],
                            ["4", "DUPATTA", "8624", "80", "9988", "370.870", "100.00", "37087.00"],
                        ].map((row, idx) => (
                            <tr key={idx}>
                                {row.map((cell, cid) => (
                                    <td key={cid} className="border border-black px-1 py-0.5 text-center">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={5} className="border border-black" />
                            <td className="border border-black text-right font-bold px-1">Sub Total :</td>
                            <td className="border border-black text-center font-bold px-1">923.770</td>
                            <td className="border border-black text-center font-bold px-1">92377.00</td>
                        </tr>
                    </tbody>
                </table>


                {/* Totals */}
                <div className="mt-2 w-full text-[11px]">
                    <div className="w-[50%] ml-auto">
                        <div className="flex justify-between">
                            <div>Taxable Amount</div>
                            <div>85910.61</div>
                        </div>
                        <div className="flex justify-between">
                            <div>CGST 2.5%</div>
                            <div>2147.77</div>
                        </div>
                        <div className="flex justify-between">
                            <div>SGST 2.5%</div>
                            <div>2147.77</div>
                        </div>
                        <div className="flex justify-between">
                            <div>Round off</div>
                            <div>-0.15</div>
                        </div>
                    </div>
                    <div className="text-right mt-2 text-[13px] font-bold">
                        Net Amount: <span className="text-[15px]">90206.00</span>
                    </div>
                    <div className="text-right font-semibold text-[10px]">TDS Amount : ______</div>
                </div>

                {/* Bank Details */}
                <div className="mt-2 text-[10px]">
                    <div className="font-bold underline">Bank Details :</div>
                    <div>Bank Name :</div>
                    <div>Branch Name :</div>
                    <div>IFSC Code :</div>
                    <div>A/C No. :</div>
                </div>

                {/* Amount in words */}
                <div className="mt-1 font-semibold text-[11px]">
                    Bill Amt. in words : Ninety Thousand Two Hundred Six Only
                </div>

                {/* Terms */}
                <div className="mt-2 text-[10px] leading-tight">
                    <div className="font-bold underline">Terms & Condition :</div>
                    <ol className="list-decimal ml-4">
                        <li>Subject to Surat Jurisdiction.</li>
                        <li>Kindly check goods before your account and at your risk & responsibility.</li>
                        <li>Any complaint regarding goods should be reported in written within 2 days.</li>
                        <li>Late payment interest 24% p.a. will be charged.</li>
                    </ol>
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-between text-[11px]">
                    <div>
                        A/c: ________ Be: ________ Cc: ________ Dt: ___/___/_____
                    </div>
                    <div className="text-right">
                        <div>For, APS FASHION</div>
                        <div className="italic mt-6">(Authorised Signatory)</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Invoice;
