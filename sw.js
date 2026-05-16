<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>ระบบทะเบียนพนักงาน / จป. (SUNWORK)</title>
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#5E64D1">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="SUNWORK Safety">
    <link id="pwa-manifest" rel="manifest" href="">

    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Tesseract.js สำหรับทำ OCR ดึงข้อมูลจากรูปภาพ -->
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <!-- SheetJS สำหรับ Export เป็น Excel -->
    <script src="https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Sarabun', 'sans-serif'],
                        heading: ['Nunito', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            purple: '#5E64D1',    
                            lightPurple: '#9A9FE8', 
                            orange: '#F48962',    
                            lightOrange: '#F9C1AE', 
                            sidebar: '#4C51B6',   
                            bg: '#F1F5FA',        
                            textDark: '#4A4F6A',  
                            textMuted: '#9FA3B9', 
                        }
                    },
                    boxShadow: {
                        'card': '0 4px 20px rgba(0, 0, 0, 0.03)',
                    }
                }
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .table-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .table-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .table-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .loader {
            border-top-color: #5E64D1;
            -webkit-animation: spinner 1.5s linear infinite;
            animation: spinner 1.5s linear infinite;
        }
        @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-brand-bg font-sans text-brand-textDark h-screen flex flex-col md:flex-row overflow-hidden">

    <!-- แถบเมนู (Sidebar บน Desktop / Bottom Nav บน Mobile) -->
      <aside class="fixed md:relative bottom-0 w-full md:w-20 h-16 md:h-full bg-brand-sidebar flex flex-row md:flex-col items-center py-0 md:py-6 justify-around md:justify-between rounded-t-2xl md:rounded-none md:rounded-r-3xl z-50 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.15)] md:shadow-lg order-last md:order-first">
        <div class="hidden md:flex flex-col items-center gap-8">
            <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
                <div class="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center text-brand-sidebar relative overflow-hidden">
                    <i class="ph-fill ph-hard-hat text-2xl"></i>
                </div>
            </div>
        </div>
        
        <nav class="flex flex-row md:flex-col w-full md:w-auto h-full md:h-auto gap-1 md:gap-6 justify-around md:justify-start items-center md:mt-4 px-2 md:px-0">
            <a href="#" onclick="switchTab('dashboard')" id="nav-dashboard" class="relative flex flex-col md:flex-row items-center justify-center text-white h-full md:h-auto p-2 md:p-3 group w-full md:w-auto" title="แดชบอร์ดสถิติ">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white rounded-b-full md:hidden nav-indicator transition-opacity duration-300 opacity-100"></div>
                <div class="absolute left-0 w-1.5 h-8 bg-white rounded-r-full hidden md:block nav-indicator transition-opacity duration-300 opacity-100"></div>
                <i class="ph-fill ph-chart-pie-slice text-2xl md:text-2xl nav-icon group-hover:scale-110 transition-transform"></i>
                <span class="text-[10px] md:hidden mt-1 font-bold">ภาพรวม</span>
            </a>
            <a href="#" onclick="switchTab('employee-list')" id="nav-employee-list" class="relative flex flex-col md:flex-row items-center justify-center text-brand-lightPurple hover:text-white transition-colors h-full md:h-auto p-2 md:p-3 group w-full md:w-auto" title="ทะเบียนพนักงาน">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white rounded-b-full md:hidden nav-indicator transition-opacity duration-300 opacity-0"></div>
                <div class="absolute left-0 w-1.5 h-8 bg-white rounded-r-full hidden md:block nav-indicator transition-opacity duration-300 opacity-0"></div>
                <i class="ph ph-users-three text-2xl md:text-2xl nav-icon group-hover:scale-110 transition-transform"></i>
                <span class="text-[10px] md:hidden mt-1 font-bold">รายชื่อ</span>
            </a>
            <a href="#" onclick="switchTab('form')" id="nav-form" class="relative flex flex-col md:flex-row items-center justify-center text-brand-lightPurple hover:text-white transition-colors h-full md:h-auto p-2 md:p-3 group w-full md:w-auto" title="เพิ่มข้อมูลพนักงาน">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-white rounded-b-full md:hidden nav-indicator transition-opacity duration-300 opacity-0"></div>
                <div class="absolute left-0 w-1.5 h-8 bg-white rounded-r-full hidden md:block nav-indicator transition-opacity duration-300 opacity-0"></div>
                <i class="ph ph-user-plus text-2xl md:text-2xl nav-icon group-hover:scale-110 transition-transform"></i>
                <span class="text-[10px] md:hidden mt-1 font-bold">ฟอร์มข้อมูล</span>
            </a>
        </nav>
        
        <div class="hidden md:flex mt-auto flex-col items-center gap-4 w-full pb-4">
            <a href="#" id="installPwaBtn" class="hidden relative flex items-center justify-center text-brand-orange hover:text-white transition-colors p-3 group bg-white/10 rounded-full mb-2 shadow-lg" title="ติดตั้งแอป (PWA)">
                <i class="ph-bold ph-download-simple text-2xl group-hover:scale-110 transition-transform animate-bounce"></i>
            </a>
        </div>
    </aside>

    <!-- พื้นที่เนื้อหาหลัก -->
    <main class="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto no-scrollbar relative w-full">
        
        <!-- ส่วนหัว (Header) แก้ไขโครงสร้างไม่ให้ตกบรรทัด -->
        <div class="flex justify-between items-center mb-4 md:mb-6 gap-2 md:gap-4 pt-2 md:pt-0 w-full">
            <div class="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <div class="md:hidden w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md shrink-0 border-2 border-white overflow-hidden p-0.5">
                    <img src="https://raw.githubusercontent.com/mm12346/Sunwork/refs/heads/main/Sunwork.png" alt="SUNWORK Logo" class="w-full h-full object-contain rounded-full">
                </div>
                <div class="flex-1 min-w-0">
                    <h1 class="text-lg sm:text-2xl md:text-3xl font-extrabold text-gray-800 font-heading tracking-tight truncate">ทะเบียนพนักงาน / จป.</h1>
                    <p class="text-brand-textMuted text-[10px] sm:text-sm mt-0.5 truncate">SUNWORK COMPANY LIMITED</p>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <!-- ปุ่มรีเฟรช (แสดงทุกหน้าจอ รวม Desktop) -->
                <button onclick="fetchData()" class="flex items-center justify-center gap-1.5 text-brand-purple bg-white p-2 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 transition-all shrink-0 group" title="รีเฟรชข้อมูล">
                    <i class="ph-bold ph-arrows-clockwise text-lg md:text-base group-hover:rotate-180 transition-transform duration-500"></i>
                    <span class="hidden md:inline text-xs font-bold">รีเฟรชข้อมูล</span>
                </button>
                <div class="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 shrink-0">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-xs font-bold text-gray-600">ระบบออนไลน์ V5.1</span>
                </div>
            </div>
        </div>

        <!-- ================= วิว: แดชบอร์ด (Dashboard) ================= -->
        <div id="dashboard-view" class="flex flex-col xl:flex-row gap-6 w-full fade-in">
            <div class="flex-1 flex flex-col gap-6 w-full">
                
                <!-- แถว 1: สรุปภาพรวมหลัก -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div class="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-card flex flex-col justify-between border-t-4 border-brand-purple transition-transform">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-gray-600 text-sm">พนักงานทั้งหมด</h3>
                            <div class="p-2 bg-brand-bg rounded-lg text-brand-purple"><i class="ph-fill ph-users text-xl"></i></div>
                        </div>
                        <div class="flex items-end gap-2 mt-2">
                            <span id="dashTotal" class="text-3xl md:text-4xl font-extrabold text-gray-800 font-heading">0</span>
                            <span class="text-xs md:text-sm text-brand-textMuted mb-1">คน</span>
                        </div>
                    </div>

                    <div class="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-card flex flex-col justify-between border-t-4 border-green-500 transition-transform">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-gray-600 text-sm">ผ่านการอบรมแล้ว</h3>
                            <div class="p-2 bg-green-50 rounded-lg text-green-500"><i class="ph-fill ph-check-circle text-xl"></i></div>
                        </div>
                        <div class="flex items-end gap-2 mt-2">
                            <span id="dashTrained" class="text-3xl md:text-4xl font-extrabold text-green-600 font-heading">0</span>
                            <span class="text-xs md:text-sm text-brand-textMuted mb-1">คน</span>
                        </div>
                        <div class="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                            <div id="barTrained" class="h-full bg-green-500 rounded-full transition-all duration-1000" style="width: 0%"></div>
                        </div>
                    </div>

                    <div class="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-card flex flex-col justify-between border-t-4 border-brand-orange transition-transform sm:col-span-2 lg:col-span-1">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold text-gray-600 text-sm">รอเข้าอบรม</h3>
                            <div class="p-2 bg-orange-50 rounded-lg text-brand-orange"><i class="ph-fill ph-warning-circle text-xl"></i></div>
                        </div>
                        <div class="flex items-end gap-2 mt-2">
                            <span id="dashWaiting" class="text-3xl md:text-4xl font-extrabold text-brand-orange font-heading">0</span>
                            <span class="text-xs md:text-sm text-brand-textMuted mb-1">คน</span>
                        </div>
                        <div class="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                            <div id="barWaiting" class="h-full bg-brand-orange rounded-full transition-all duration-1000" style="width: 0%"></div>
                        </div>
                    </div>
                </div>

                <!-- แถว 2: สรุปสถานะบัตร -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <!-- สถานะทำบัตร -->
                    <div class="bg-white rounded-[1.5rem] p-5 shadow-card flex flex-col justify-center border border-gray-100">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-bold text-gray-700 text-sm flex items-center gap-2"><i class="ph-fill ph-identification-badge text-brand-purple text-lg"></i> สถานะการทำบัตร</h3>
                        </div>
                        <div class="flex justify-around items-center bg-gray-50 rounded-xl p-3">
                            <div class="text-center">
                                <div class="text-xs text-gray-500 mb-1">ทำบัตรแล้ว</div>
                                <div class="flex items-baseline justify-center gap-1">
                                    <div class="text-2xl font-extrabold text-green-600 font-heading" id="dashCardDone">0</div>
                                    <span class="text-[10px] text-gray-400">คน</span>
                                </div>
                            </div>
                            <div class="w-px h-8 bg-gray-200"></div>
                            <div class="text-center">
                                <div class="text-xs text-gray-500 mb-1">รอทำบัตร / ยังไม่ทำ</div>
                                <div class="flex items-baseline justify-center gap-1">
                                    <div class="text-2xl font-extrabold text-red-500 font-heading" id="dashCardWait">0</div>
                                    <span class="text-[10px] text-gray-400">คน</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- สถานะรับบัตร -->
                    <div class="bg-white rounded-[1.5rem] p-5 shadow-card flex flex-col justify-center border border-gray-100">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-bold text-gray-700 text-sm flex items-center gap-2"><i class="ph-fill ph-hand-swipe-right text-blue-500 text-lg"></i> สถานะการรับบัตร</h3>
                        </div>
                        <div class="flex justify-around items-center bg-gray-50 rounded-xl p-3">
                            <div class="text-center">
                                <div class="text-xs text-gray-500 mb-1">รับบัตรแล้ว</div>
                                <div class="flex items-baseline justify-center gap-1">
                                    <div class="text-2xl font-extrabold text-blue-600 font-heading" id="dashReceiveDone">0</div>
                                    <span class="text-[10px] text-gray-400">คน</span>
                                </div>
                            </div>
                            <div class="w-px h-8 bg-gray-200"></div>
                            <div class="text-center">
                                <div class="text-xs text-gray-500 mb-1">ยังไม่รับ / รอรับ</div>
                                <div class="flex items-baseline justify-center gap-1">
                                    <div class="text-2xl font-extrabold text-orange-500 font-heading" id="dashReceiveWait">0</div>
                                    <span class="text-[10px] text-gray-400">คน</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- แถว 3: สรุปผู้รับเหมา -->
                <div class="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-card border border-gray-100">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-gray-800 text-sm md:text-base flex items-center gap-2">
                            <i class="ph-fill ph-buildings text-brand-orange text-xl"></i> จำนวนพนักงานแยกตามชุดผู้รับเหมา
                        </h3>
                    </div>
                    <!-- รายชื่อผู้รับเหมาจะถูกแทรกที่นี่ผ่าน JS -->
                    <div id="contractorSummaryList" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2 table-scrollbar">
                        <!-- Data inserted here -->
                    </div>
                </div>

                <div class="bg-gradient-to-r from-brand-sidebar to-brand-purple rounded-[1.5rem] p-6 md:p-8 shadow-card text-white flex justify-between items-center relative overflow-hidden mt-2">
                    <i class="ph-fill ph-shield-check absolute -right-4 -bottom-8 md:-right-10 md:-bottom-10 text-[120px] md:text-[150px] opacity-10"></i>
                    <div class="z-10 w-full md:w-auto">
                        <h2 class="text-lg md:text-xl font-bold mb-2">เป้าหมายความปลอดภัย 100%</h2>
                        <p class="text-brand-lightPurple text-xs md:text-sm max-w-md">ตรวจสอบสถานะการอบรมพนักงานอย่างสม่ำเสมอ เพื่อให้มั่นใจว่าทุกคนมีความรู้ความเข้าใจในกฎระเบียบความปลอดภัยก่อนเริ่มปฏิบัติงาน</p>
                    </div>
                    <button onclick="switchTab('employee-list')" class="hidden md:block z-10 bg-white text-brand-purple px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform shrink-0">
                        ดูรายชื่อพนักงาน
                    </button>
                </div>
            </div>

            <!-- คอลัมน์ขวา: Chart -->
            <div class="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
                <div class="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-card flex-1 flex flex-col min-h-[280px]">
                    <h3 class="font-bold text-gray-800 mb-1">สัดส่วนสถานะการอบรม</h3>
                    <p class="text-xs text-brand-textMuted mb-4">ภาพรวมพนักงานทั้งหมดในระบบ</p>
                    
                    <div class="flex-1 relative flex items-center justify-center">
                        <div class="w-[180px] h-[180px] md:w-[200px] md:h-[200px] relative">
                            <canvas id="statusChart"></canvas>
                            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span class="text-[10px] md:text-xs text-gray-400">คิดเป็น</span>
                                <span id="percentTrained" class="text-xl md:text-2xl font-extrabold text-brand-purple font-heading mt-[-4px]">0%</span>
                                <span class="text-[9px] md:text-[10px] text-gray-500">ที่อบรมแล้ว</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-center gap-4 mt-4 md:mt-6">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-brand-purple"></div>
                            <span class="text-xs text-gray-600 font-medium">อบรมแล้ว</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-brand-orange"></div>
                            <span class="text-xs text-gray-600 font-medium">รออบรม</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ================= วิว: รายชื่อพนักงาน (Table) ================= -->
        <div id="employee-list-view" class="hidden w-full mx-auto fade-in pb-4">
            <div class="bg-white rounded-[1.5rem] p-4 md:p-8 shadow-card flex flex-col gap-4">
                
                <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-2 w-full">
                    <div class="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto flex-1">
                        <div class="relative w-full bg-gray-50 rounded-full flex items-center px-4 py-2 border border-gray-200 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/20 transition-all">
                            <i class="ph ph-magnifying-glass text-gray-400 text-lg"></i>
                            <input type="text" id="searchInput" onkeyup="filterTable()" placeholder="ค้นหาชื่อ, เลขบัตร..." class="bg-transparent border-none outline-none text-sm w-full ml-2 text-gray-700 placeholder-gray-400 font-sans">
                        </div>
                        
                        <div class="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                            <div class="relative w-full sm:w-40 bg-gray-50 rounded-full border border-gray-200 focus-within:border-brand-purple transition-all shrink-0">
                                <select id="filterStatus" onchange="filterTable()" class="w-full bg-transparent border-none outline-none text-sm text-gray-700 px-4 py-2.5 appearance-none cursor-pointer font-sans">
                                    <option value="all">สถานะทั้งหมด</option>
                                    <option value="อบรมแล้ว">เฉพาะ อบรมแล้ว</option>
                                    <option value="รออบรม">เฉพาะ รออบรม</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                            
                            <!-- ตัวกรองชุดผู้รับเหมา -->
                            <div class="relative w-full sm:w-44 bg-gray-50 rounded-full border border-gray-200 focus-within:border-brand-purple transition-all shrink-0">
                                <select id="filterContractor" onchange="filterTable()" class="w-full bg-transparent border-none outline-none text-sm text-gray-700 px-4 py-2.5 appearance-none cursor-pointer font-sans">
                                    <option value="all">ทุกชุดผู้รับเหมา</option>
                                    <!-- ตัวเลือกจะถูกสร้างอัตโนมัติจากข้อมูล -->
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ปรับแต่งปุ่มในหน้าจอเล็กให้เป็น Grid คู่ ไม่ล้นจอ -->
                    <div class="grid grid-cols-2 md:flex md:flex-row w-full xl:w-auto shrink-0 gap-2 mt-2 xl:mt-0">
                        <button onclick="openExportModal()" class="w-full md:w-auto flex justify-center items-center gap-1.5 md:gap-2 bg-green-600 text-white px-3 sm:px-5 py-2.5 rounded-full text-xs md:text-sm font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-600/20 truncate">
                            <i class="ph-bold ph-file-xls text-base md:text-lg"></i> <span class="truncate">ส่งออก Excel</span>
                        </button>
                        <button onclick="resetFormState(); switchTab('form');" class="w-full md:w-auto flex justify-center items-center gap-1.5 md:gap-2 bg-brand-purple text-white px-3 sm:px-5 py-2.5 rounded-full text-xs md:text-sm font-bold hover:bg-[#4C51B6] transition-colors shadow-md shadow-brand-purple/20 truncate">
                            <i class="ph-bold ph-plus text-base md:text-lg"></i> <span class="truncate">เพิ่มข้อมูล</span>
                        </button>
                    </div>
                </div>

                <div id="loadingIndicator" class="py-16 flex flex-col items-center justify-center text-brand-textMuted hidden">
                    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-100 h-10 w-10 mb-4"></div>
                    <p class="font-medium text-sm">กำลังดึงข้อมูลจากฐานข้อมูล...</p>
                </div>

                <div class="overflow-auto max-h-[60vh] table-scrollbar border border-gray-100 rounded-xl relative w-full" id="tableContainer">
                    <table class="w-full text-left border-collapse min-w-[900px]">
                        <thead class="bg-gray-50 sticky top-0 z-20 shadow-sm outline outline-1 outline-gray-200">
                            <tr class="text-[11px] text-gray-500 uppercase tracking-wider border-b border-gray-200 font-bold">
                                <th class="py-3 px-4 text-center w-12 bg-gray-50">รูป</th>
                                <th class="py-3 px-4 bg-gray-50">ชื่อ-นามสกุล</th>
                                <th class="py-3 px-4 bg-gray-50">เลขบัตรประชาชน</th>
                                <th class="py-3 px-4 bg-gray-50">ตำแหน่ง</th>
                                <th class="py-3 px-4 bg-gray-50">สังกัดชุด</th>
                                <th class="py-3 px-4 text-center bg-gray-50">เอกสาร</th>
                                <th class="py-3 px-4 text-center bg-gray-50">สถานะอบรม</th>
                                <th class="py-3 px-4 text-center bg-gray-50">สถานะทำบัตร</th>
                                <th class="py-3 px-4 text-center bg-gray-50">ชุดผู้รับเหมา</th>
                            </tr>
                        </thead>
                        <tbody id="employeeTableBody" class="text-[13px] md:text-sm text-gray-700 divide-y divide-gray-100">
                            <!-- ข้อมูลจะถูกแทรกที่นี่ -->
                        </tbody>
                    </table>
                    
                    <div id="noDataMessage" class="hidden py-16 flex flex-col items-center justify-center text-gray-400">
                        <i class="ph ph-folder-open text-4xl mb-3 opacity-50"></i>
                        <p class="font-medium text-sm text-gray-500">ไม่พบข้อมูลที่ค้นหา</p>
                    </div>
                </div>
                
                <div class="flex flex-col sm:flex-row justify-between items-center mt-2 text-[11px] md:text-xs text-brand-textMuted font-medium px-2 gap-2">
                    <span id="tableSummaryText">แสดงข้อมูลทั้งหมด</span>
                    <span class="flex items-center gap-1"><i class="ph-fill ph-database text-brand-lightPurple"></i> ซิงค์ข้อมูลล่าสุดเมื่อสักครู่</span>
                </div>
            </div>
        </div>

        <!-- ================= วิว: ฟอร์มเพิ่มข้อมูล (Form) ================= -->
        <div id="form-view" class="hidden w-full max-w-4xl mx-auto fade-in pb-10">
            <div class="bg-white rounded-[1.5rem] p-5 sm:p-6 md:p-10 shadow-card relative overflow-hidden">
                
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-purple"></div>
                
                <div class="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-100 mt-2">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-bg flex items-center justify-center text-brand-purple shadow-sm border border-white shrink-0">
                        <i class="ph-fill ph-user-plus text-xl md:text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <h2 id="formTitle" class="text-xl md:text-2xl font-extrabold text-gray-800 font-heading leading-tight truncate">เพิ่มข้อมูลพนักงาน</h2>
                        <p class="text-xs md:text-sm text-brand-textMuted mt-0.5 truncate">บันทึกข้อมูลเข้าสู่ระบบทะเบียน</p>
                    </div>
                </div>

                <form id="employeeDataForm" onsubmit="submitForm(event)">
                    
                    <!-- ส่วนอัปโหลดรูปภาพโปรไฟล์ -->
                    <div class="flex flex-col items-center justify-center mb-8">
                        <div class="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-brand-bg border-2 border-dashed border-brand-lightPurple flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-indigo-50 transition-colors group shadow-sm" onclick="document.getElementById('inpProfileImage').click()">
                            <!-- กรณีมีรูป -->
                            <img id="profileImagePreview" class="w-full h-full object-cover hidden absolute inset-0 z-10" />
                            <!-- กรณีไม่มีรูป -->
                            <div class="z-0 flex flex-col items-center" id="profileImagePlaceholder">
                                <i class="ph-fill ph-camera text-3xl text-brand-lightPurple group-hover:scale-110 transition-transform"></i>
                                <span class="text-[10px] text-brand-purple font-bold mt-1">เพิ่มรูปถ่าย</span>
                            </div>
                            <!-- Overlay ตอนมีรูปแล้ว hover -->
                            <div class="absolute inset-0 bg-black/40 z-20 hidden group-hover:flex items-center justify-center transition-opacity" id="profileImageOverlay">
                                <i class="ph-fill ph-pencil-simple text-white text-xl"></i>
                            </div>
                        </div>
                        <input type="file" id="inpProfileImage" accept="image/*" class="hidden" onchange="handleImagePreview(this, 'profileImagePreview', 'profileImagePlaceholder', 'profileImageOverlay')">
                        <span class="text-[11px] text-gray-400 mt-3 font-medium">รองรับไฟล์ JPG, PNG ไม่เกิน 5MB</span>
                    </div>

                    <!-- 1. ข้อมูลบุคคล -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <h3 class="text-base md:text-lg font-bold text-gray-700 flex items-center gap-2">
                            <i class="ph-fill ph-identification-card text-brand-purple"></i> ข้อมูลบุคคล
                        </h3>
                        <div>
                            <!-- ปุ่มสแกนบัตร -->
                            <input type="file" id="idCardImage" accept="image/*" capture="environment" class="hidden" onchange="processIdCard(this)">
                            <button type="button" onclick="document.getElementById('idCardImage').click()" class="flex items-center gap-2 bg-indigo-50 text-brand-purple px-4 py-2 rounded-full text-xs md:text-sm font-bold hover:bg-indigo-100 transition-colors border border-indigo-100 w-full sm:w-auto justify-center shadow-sm">
                                <i class="ph-bold ph-scan text-base md:text-lg"></i> สแกนดึงข้อมูลอัตโนมัติ
                            </button>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-600 mb-1.5 md:mb-2">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
                            <input type="text" id="inpName" required placeholder="นาย/นาง/นางสาว ..." class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-sans">
                        </div>
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-600 mb-1.5 md:mb-2">เลขบัตรประชาชน <span class="text-red-500">*</span></label>
                            <input type="text" id="inpId" required placeholder="x-xxxx-xxxxx-xx-x" class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-sans tracking-widest">
                        </div>
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-600 mb-1.5 md:mb-2">วัน/เดือน/ปีเกิด <span class="text-red-500">*</span></label>
                            <input type="date" id="inpDob" required onchange="autoCalcAge()" class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-sans text-gray-600">
                        </div>
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-600 mb-1.5 md:mb-2">อายุ (คำนวณอัตโนมัติ)</label>
                            <input type="text" id="inpAge" readonly placeholder="กรอกวันเกิดเพื่อคำนวณ" class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm font-sans font-bold cursor-not-allowed">
                        </div>
                    </div>

                    <!-- 2. ข้อมูลตำแหน่งและสังกัด -->
                    <h3 class="text-base md:text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 border-t border-gray-100 pt-6 md:pt-8">
                        <i class="ph-fill ph-briefcase text-brand-orange"></i> ข้อมูลตำแหน่งและสังกัด
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-600 mb-1.5 md:mb-2">ตำแหน่ง (Position) <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select id="inpPos" required class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-sans appearance-none cursor-pointer">
                                    <option value="" disabled selected>กำลังโหลดข้อมูล...</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-600 mb-1.5 md:mb-2">สังกัดชุด (Group) <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select id="inpGroup" required class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-sans appearance-none cursor-pointer">
                                    <option value="" disabled selected>กำลังโหลดข้อมูล...</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                        <div class="sm:col-span-2 md:col-span-1">
                            <label class="block text-xs md:text-sm font-bold text-gray-600 mb-1.5 md:mb-2">ชุดผู้รับเหมา <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select id="inpContractor" required class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-sans appearance-none cursor-pointer">
                                    <option value="" disabled selected>กำลังโหลดข้อมูล...</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                    </div>

                    <!-- 3. สถานะต่างๆ -->
                    <h3 class="text-base md:text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 border-t border-gray-100 pt-6 md:pt-8">
                        <i class="ph-fill ph-shield-check text-green-500"></i> สถานะการอบรมและการทำเอกสาร
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10 bg-brand-bg p-4 md:p-6 rounded-2xl border border-gray-100">
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">สถานะเอกสาร <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select id="inpDocStatus" required class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer">
                                    <option value="ครบ" class="text-green-600">ครบ</option>
                                    <option value="ไม่ครบ" class="text-red-600">ไม่ครบ</option>
                                    <option value="ขาดประกัน" class="text-orange-600">ขาดประกัน</option>
                                    <option value="ขาดบัตร" class="text-orange-600">ขาดบัตร</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">สถานะการอบรม <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select id="inpTrain" required class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer">
                                    <option value="อบรมแล้ว" class="text-green-600">อบรมแล้ว</option>
                                    <option value="รออบรมรอบถัดไป" class="text-yellow-600">รออบรมรอบถัดไป</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">วันที่อบรม <span class="text-[10px] md:text-xs text-gray-400 font-normal">(ถ้ามี)</span></label>
                            <input type="date" id="inpTrainDate" class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-sans text-gray-600">
                        </div>
                        <div>
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">สถานะการทำบัตร <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select id="inpCard" required class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer">
                                    <option value="ทำบัตรแล้ว">ทำบัตรแล้ว</option>
                                    <option value="รออบรม">รออบรม (ยังไม่ได้บัตร)</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 md:mb-2">สถานะรับบัตร <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <select id="inpCardReceive" required class="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm font-bold text-gray-700 appearance-none cursor-pointer">
                                    <option value="ยังไม่รับ" class="text-gray-500">ยังไม่รับ / รอรับบัตร</option>
                                    <option value="รับแล้ว" class="text-blue-600">รับแล้ว</option>
                                </select>
                                <i class="ph ph-caret-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onclick="resetFormState(); switchTab('employee-list')" class="w-full sm:w-auto px-6 py-3 text-sm font-bold text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                            ยกเลิก
                        </button>
                        <button id="btnSubmit" type="submit" class="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-brand-purple rounded-full hover:bg-[#4C51B6] shadow-lg shadow-brand-purple/30 transition-all transform hover:-translate-y-0.5">
                            <i class="ph-bold ph-floppy-disk text-lg"></i> <span id="btnSubmitText">บันทึกข้อมูลเข้าฐานระบบ</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </main>

    <!-- ป๊อปอัป (Modal) ที่รองรับทั้งการ ดูรายละเอียด และ แก้ไขข้อมูล -->
    <div id="detailsModal" class="fixed inset-0 z-[60] hidden flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 opacity-0 p-4">
        <div id="detailsModalContent" class="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-2xl transform scale-95 transition-all duration-300 overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]">
            
            <!-- Header -->
            <div class="bg-gradient-to-r from-brand-sidebar to-brand-purple p-4 md:p-6 text-white flex justify-between items-center shrink-0">
                <h3 id="detailsModalTitle" class="text-lg md:text-xl font-bold font-heading flex items-center gap-2">
                    <i class="ph-fill ph-user-circle text-xl md:text-2xl"></i> รายละเอียดพนักงาน
                </h3>
                <button onclick="closeDetailsModal()" class="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full flex items-center justify-center shrink-0">
                    <i class="ph-bold ph-x text-base md:text-lg"></i>
                </button>
            </div>

            <!-- VIEW MODE (โหมดดูรายละเอียด) -->
            <div id="detailsViewMode" class="flex flex-col overflow-hidden">
                <div class="p-4 sm:p-5 md:p-8 overflow-y-auto no-scrollbar" id="detailsModalBody">
                    <!-- ข้อมูลรายละเอียดจะถูกแทรกผ่าน JS -->
                </div>
                <div class="bg-gray-50 p-3 md:p-4 border-t border-gray-100 flex flex-col-reverse md:flex-row justify-end shrink-0 gap-2 w-full" id="detailsModalFooter">
                    <!-- ปุ่ม แก้ไข และ ลบ จะถูกแทรกผ่าน JS -->
                </div>
            </div>

            <!-- EDIT MODE (โหมดแก้ไขข้อมูล) -->
            <form id="editViewMode" class="hidden flex flex-col overflow-hidden h-full" onsubmit="submitModalEdit(event)">
                <div class="p-4 md:p-6 overflow-y-auto no-scrollbar space-y-4 md:space-y-6">
                    
                    <!-- ส่วนเปลี่ยนรูปโปรไฟล์ -->
                    <div class="flex flex-col items-center justify-center mb-2">
                        <div class="relative w-24 h-24 rounded-full bg-brand-bg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors group" onclick="document.getElementById('editInpProfileImage').click()">
                            <img id="editProfileImagePreview" class="w-full h-full object-cover hidden absolute inset-0 z-10" />
                            <div class="z-0 flex flex-col items-center" id="editProfileImagePlaceholder">
                                <i class="ph-fill ph-camera text-2xl text-gray-400"></i>
                            </div>
                            <div class="absolute inset-0 bg-black/40 z-20 hidden group-hover:flex items-center justify-center transition-opacity" id="editProfileImageOverlay">
                                <i class="ph-fill ph-camera-plus text-white text-xl"></i>
                            </div>
                        </div>
                        <input type="file" id="editInpProfileImage" accept="image/*" class="hidden" onchange="handleImagePreview(this, 'editProfileImagePreview', 'editProfileImagePlaceholder', 'editProfileImageOverlay')">
                        <span class="text-[10px] text-gray-400 mt-2">แตะเพื่อเปลี่ยนรูป</span>
                    </div>

                    <!-- 1. ข้อมูลบุคคล -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
                            <input type="text" id="editInpName" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple/20 outline-none text-sm text-gray-800 font-medium">
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">เลขบัตรประชาชน <span class="text-red-500">*</span></label>
                            <input type="text" id="editInpId" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple/20 outline-none text-sm font-mono text-gray-800">
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">วันเกิด <span class="text-red-500">*</span></label>
                            <input type="date" id="editInpDob" required onchange="autoCalcAgeEdit()" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple/20 outline-none text-sm text-gray-800">
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">อายุ</label>
                            <input type="text" id="editInpAge" readonly class="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed font-bold">
                        </div>
                    </div>
                    
                    <!-- 2. ตำแหน่ง/สังกัด -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">ตำแหน่ง <span class="text-red-500">*</span></label>
                            <select id="editInpPos" required class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-medium"></select>
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">สังกัดชุด <span class="text-red-500">*</span></label>
                            <select id="editInpGroup" required class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-medium"></select>
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">ชุดผู้รับเหมา <span class="text-red-500">*</span></label>
                            <select id="editInpContractor" required class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-medium"></select>
                        </div>
                    </div>

                    <!-- 3. สถานะต่างๆ -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 bg-brand-bg p-3 md:p-4 rounded-xl border border-gray-100">
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">สถานะเอกสาร <span class="text-red-500">*</span></label>
                            <select id="editInpDocStatus" required class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-bold">
                                <option value="ครบ">ครบ</option><option value="ไม่ครบ">ไม่ครบ</option><option value="ขาดประกัน">ขาดประกัน</option><option value="ขาดบัตร">ขาดบัตร</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">สถานะการอบรม <span class="text-red-500">*</span></label>
                            <select id="editInpTrain" required class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-bold">
                                <option value="อบรมแล้ว">อบรมแล้ว</option><option value="รออบรมรอบถัดไป">รออบรมรอบถัดไป</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">วันที่อบรม <span class="text-[10px] text-gray-400 font-normal">(ถ้ามี)</span></label>
                            <input type="date" id="editInpTrainDate" class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-purple/20 outline-none text-sm text-gray-800">
                        </div>
                        <div>
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">สถานะการทำบัตร <span class="text-red-500">*</span></label>
                            <select id="editInpCard" required class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-bold">
                                <option value="ทำบัตรแล้ว">ทำบัตรแล้ว</option><option value="รออบรม">รออบรม (ยังไม่ได้บัตร)</option>
                            </select>
                        </div>
                        <div class="sm:col-span-2">
                            <label class="block text-[11px] md:text-xs font-bold text-gray-700 mb-1">สถานะรับบัตร <span class="text-red-500">*</span></label>
                            <select id="editInpCardReceive" required class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 font-bold">
                                <option value="ยังไม่รับ">ยังไม่รับ / รอรับบัตร</option><option value="รับแล้ว">รับแล้ว</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Footer โหมดแก้ไข -->
                <div class="bg-gray-50 p-3 md:p-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0 w-full">
                    <button type="button" onclick="cancelEditMode()" class="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs md:text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        ยกเลิก
                    </button>
                    <button id="btnModalSubmit" type="submit" class="w-full sm:w-auto px-6 py-2.5 bg-brand-purple text-white rounded-full text-xs md:text-sm font-bold hover:bg-[#4C51B6] transition-colors shadow-sm flex items-center justify-center gap-2">
                        <i class="ph-bold ph-floppy-disk text-lg"></i> บันทึกการแก้ไข
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ป๊อปอัปยืนยันการลบ (Delete Confirmation Modal) -->
    <div id="deleteConfirmModal" class="fixed inset-0 z-[70] hidden flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 opacity-0 p-4">
        <div id="deleteConfirmContent" class="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center shadow-2xl w-full max-w-sm transform scale-95 transition-all duration-300 text-center">
            <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-inner shrink-0">
                <i class="ph-fill ph-trash text-3xl"></i>
            </div>
            <h4 class="font-extrabold text-gray-800 text-lg md:text-xl">ยืนยันการลบข้อมูล</h4>
            <p class="text-xs sm:text-sm text-gray-500 mt-2">คุณต้องการลบข้อมูลพนักงานรายการนี้ใช่หรือไม่?<br><span class="text-red-500 font-medium">การลบข้อมูลไม่สามารถเรียกคืนได้</span></p>
            <div class="flex flex-col sm:flex-row gap-3 w-full mt-6">
                <button onclick="closeDeleteConfirmModal()" class="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                    ยกเลิก
                </button>
                <button onclick="executeDeleteEmployee()" class="w-full px-4 py-3 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors shadow-md shadow-red-500/30 flex items-center justify-center gap-2">
                    <i class="ph-bold ph-trash"></i> ยืนยันลบ
                </button>
            </div>
        </div>
    </div>

    <!-- ป๊อปอัปตั้งค่าการ Export Excel (Export Modal) -->
    <div id="exportModal" class="fixed inset-0 z-[70] hidden flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 opacity-0 p-4">
        <div id="exportModalContent" class="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-lg transform scale-95 transition-all duration-300 overflow-hidden flex flex-col max-h-[85vh]">
            <!-- Header -->
            <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-5 text-white flex justify-between items-center shrink-0">
                <h3 class="text-lg md:text-xl font-bold font-heading flex items-center gap-2">
                    <i class="ph-fill ph-file-xls text-xl"></i> เลือกข้อมูลที่ต้องการส่งออก
                </h3>
                <button onclick="closeExportModal()" class="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full flex items-center justify-center shrink-0">
                    <i class="ph-bold ph-x text-base md:text-lg"></i>
                </button>
            </div>
            <!-- Body -->
            <div class="p-4 md:p-6 overflow-y-auto no-scrollbar flex-1">
                <div class="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                    <span class="text-sm font-bold text-gray-700">เลือกคอลัมน์ที่ต้องการ</span>
                    <button type="button" onclick="toggleAllExportCols()" class="text-xs text-brand-purple hover:underline font-bold" id="btnToggleExportCols">ยกเลิกทั้งหมด</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="exportColsContainer">
                    <!-- Checkboxes will be rendered here by JS -->
                </div>
            </div>
            <!-- Footer -->
            <div class="bg-gray-50 p-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
                <button onclick="closeExportModal()" class="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">ยกเลิก</button>
                <button onclick="exportToExcel()" class="w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 transition-colors shadow-md shadow-green-600/20 flex justify-center items-center gap-2">
                    <i class="ph-bold ph-download-simple"></i> ยืนยันและส่งออก
                </button>
            </div>
        </div>
    </div>

    <!-- ป๊อปอัปโหลดดิ้ง OCR และการลบ (Global Loading) -->
    <div id="globalLoading" class="fixed inset-0 z-[70] hidden flex items-center justify-center bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 opacity-0 p-4">
        <div class="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center shadow-2xl w-full max-w-sm transform scale-95 transition-all duration-300" id="globalLoadingContent">
            <div class="relative w-16 h-16 md:w-20 md:h-20 mb-4 flex items-center justify-center shrink-0" id="loadingIconContainer">
                <i class="ph-duotone ph-bounding-box text-6xl md:text-7xl text-brand-lightPurple absolute"></i>
                <div class="w-full h-1 bg-brand-purple absolute top-0 animate-[scan_1.5s_ease-in-out_infinite]"></div>
                <i class="ph-fill ph-identification-card text-3xl md:text-4xl text-brand-purple" id="loadingCenterIcon"></i>
            </div>
            <h4 class="font-extrabold text-gray-800 text-base md:text-lg" id="loadingTitle">กำลังทำงาน</h4>
            <p class="text-xs md:text-sm text-gray-500 mt-1 text-center whitespace-pre-line" id="loadingSubtitle">กรุณารอสักครู่...</p>
            <div class="w-full bg-gray-100 h-1.5 rounded-full mt-4 md:mt-5 overflow-hidden">
                <div class="h-full bg-brand-purple w-1/2 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
    <style>
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
    </style>

    <!-- ป๊อปอัปแจ้งเตือน (Toast Notification) -->
    <div id="toast" class="fixed top-4 left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none md:top-8 md:right-8 bg-white border-l-4 border-green-500 text-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-500 z-[80] flex items-center gap-3 md:gap-4 w-[calc(100%-2rem)] max-w-sm md:max-w-md opacity-0 scale-90 pointer-events-none">
        <div id="toastIconBg" class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <i id="toastIcon" class="ph-fill ph-check-circle text-green-500 text-xl md:text-2xl"></i>
        </div>
        <div class="flex-1 min-w-0">
            <h4 id="toastTitle" class="font-bold text-sm text-gray-800 truncate">สำเร็จ!</h4>
            <p id="toastMsg" class="text-[11px] md:text-xs text-gray-500 mt-0.5 leading-tight truncate">ดำเนินการเสร็จสิ้น</p>
        </div>
    </div>

    <script>
        /**
         * ==========================================
         * 1. การตั้งค่าระบบ (Cloudinary และ Google Apps Script)
         * ==========================================
         */
        const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz5GmfMhcjNhj996u8QRQwPJzWGIdEFGxaUOuVnsPZeoGfqCgfwEpaTLE79oF8RDRf0/exec"; 
        
        // --- การตั้งค่า Cloudinary ---
        // เปลี่ยนค่าด้านล่างเป็นของคุณจาก Dashboard ใน Cloudinary
        const CLOUDINARY_CLOUD_NAME = "dwfaxbxjn"; // <-- ใส่ Cloud Name
        const CLOUDINARY_UPLOAD_PRESET = "Sunwork1"; // <-- ใส่ Upload Preset แบบ Unsigned
        
        let localData = [];
        let currentFilteredData = []; 
        let donutChartInstance = null;
        let currentEditNo = null; 
        let currentEditImageUrl = ""; // เก็บ URL รูปเดิมตอนกด Edit
        let employeeToDeleteNo = null;

        // ==========================================
        // ระบบ PWA
        // ==========================================
        let deferredPrompt;
        
        function initPWA() {
            const logoUrl = "https://raw.githubusercontent.com/mm12346/Sunwork/refs/heads/main/Sunwork.png";

            const manifest = {
                name: "ทะเบียน จป. SUNWORK",
                short_name: "SW Safety",
                description: "ระบบลงทะเบียนและตรวจสอบสถานะการอบรมความปลอดภัยพนักงาน",
                start_url: window.location.href.split('?')[0],
                display: "standalone",
                background_color: "#F1F5FA",
                theme_color: "#5E64D1",
                icons: [{
                    src: logoUrl,
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any maskable"
                }]
            };

            const manifestString = JSON.stringify(manifest);
            const manifestUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(manifestString);
            const manifestTag = document.getElementById('pwa-manifest');
            if(manifestTag) manifestTag.href = manifestUrl;

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                
                const installBtn = document.getElementById('installPwaBtn');
                if(installBtn) {
                    installBtn.classList.remove('hidden');
                    installBtn.addEventListener('click', async (evt) => {
                        evt.preventDefault();
                        if(!deferredPrompt) return;
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') {
                            installBtn.classList.add('hidden');
                        }
                        deferredPrompt = null;
                    });
                }
            });

            window.addEventListener('appinstalled', () => {
                const installBtn = document.getElementById('installPwaBtn');
                if(installBtn) installBtn.classList.add('hidden');
                showToast('ติดตั้งสำเร็จ', 'แอปถูกติดตั้งลงในอุปกรณ์ของคุณแล้ว', 'success');
            });
        }
        
        initPWA();

        document.addEventListener('DOMContentLoaded', () => {
            Chart.defaults.font.family = "'Sarabun', sans-serif";
            fetchData();
        });

        // ==========================================
        // ฟังก์ชันอัปโหลดรูปภาพไปยัง Cloudinary (Upload Function)
        // ==========================================
        async function uploadImageToCloudinary(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.secure_url) {
                    return data.secure_url;
                } else {
                    throw new Error("Failed to upload image");
                }
            } catch (error) {
                console.error("Cloudinary Error: ", error);
                throw error;
            }
        }

        // ฟังก์ชัน Preview รูปภาพตอนผู้ใช้เลือกไฟล์
        function handleImagePreview(input, previewId, placeholderId, overlayId = null) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgPreview = document.getElementById(previewId);
                    const placeholder = document.getElementById(placeholderId);
                    
                    imgPreview.src = e.target.result;
                    imgPreview.classList.remove('hidden');
                    if(placeholder) placeholder.classList.add('hidden');
                    
                    if(overlayId) {
                        const overlay = document.getElementById(overlayId);
                        overlay.classList.add('group-hover:flex');
                    }
                }
                reader.readAsDataURL(file);
            }
        }

        // ==========================================
        // 2. ฟังก์ชันดึงข้อมูล (GET)
        // ==========================================
        async function fetchData() {
            const loading = document.getElementById('loadingIndicator');
            const tableCont = document.getElementById('tableContainer');
            const tbody = document.getElementById('employeeTableBody');
            
            if(document.getElementById('employee-list-view').classList.contains('hidden') === false) {
                loading.classList.remove('hidden');
                tableCont.classList.add('hidden');
            }
            
            try {
                if(WEB_APP_URL === "") throw new Error("URL_EMPTY");

                const urlWithCacheBuster = WEB_APP_URL + (WEB_APP_URL.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
                
                const response = await fetch(urlWithCacheBuster, { cache: "no-store" });
                if (!response.ok) throw new Error('Network response was not ok');
                const dataResponse = await response.json();
                
                if (dataResponse.employees && dataResponse.config) {
                    localData = dataResponse.employees;
                    populateDropdownsFromConfig(dataResponse.config);
                } else {
                    localData = Array.isArray(dataResponse) ? dataResponse : [];
                }

                processData(localData);
                hideLoading();

            } catch (error) {
                console.error("Fetch Data Error:", error);
                hideLoading();
                
                if (error.message === "URL_EMPTY") {
                    tbody.innerHTML = `<tr><td colspan="10" class="text-center py-10 text-brand-orange font-bold"><i class="ph-fill ph-warning-circle text-4xl mb-3"></i><br>กรุณาตั้งค่าตัวแปร WEB_APP_URL ในโค้ด<br><span class="text-xs font-normal text-gray-500">เพื่อเชื่อมต่อดึงข้อมูลจาก Google Sheets</span></td></tr>`;
                    updateDashboardCards([]);
                } else {
                    tbody.innerHTML = `<tr><td colspan="10" class="text-center py-10 text-red-500 font-bold"><i class="ph-fill ph-x-circle text-4xl mb-3"></i><br>ไม่สามารถเชื่อมต่อฐานข้อมูลได้<br><span class="text-xs font-normal text-gray-500">โปรดตรวจสอบ URL ของ Apps Script หรือสิทธิ์การเข้าถึงอินเทอร์เน็ต</span></td></tr>`;
                }
            }

            function hideLoading() {
                loading.classList.add('hidden');
                tableCont.classList.remove('hidden');
            }
        }

        // ==========================================
        // 3. ฟังก์ชันประมวลผลข้อมูลลง UI
        // ==========================================
        function populateDropdownsFromConfig(config) {
            const posHtml = config.positions && config.positions.length > 0 
                ? '<option value="" disabled selected>เลือกตำแหน่ง...</option>' + config.positions.map(p => `<option value="${p}">${p}</option>`).join('') 
                : '<option value="" disabled selected>ไม่มีข้อมูลตำแหน่งในระบบ</option>';
            document.getElementById('inpPos').innerHTML = posHtml;
            document.getElementById('editInpPos').innerHTML = posHtml;

            const groupHtml = config.groups && config.groups.length > 0 
                ? '<option value="" disabled selected>เลือกสังกัดชุด...</option>' + config.groups.map(g => `<option value="${g}">${g}</option>`).join('') 
                : '<option value="" disabled selected>ไม่มีข้อมูลสังกัดชุดในระบบ</option>';
            document.getElementById('inpGroup').innerHTML = groupHtml;
            document.getElementById('editInpGroup').innerHTML = groupHtml;

            const contractorHtml = config.contractors && config.contractors.length > 0 
                ? '<option value="" disabled selected>เลือกชุดผู้รับเหมา...</option>' + config.contractors.map(c => `<option value="${c}">${c}</option>`).join('') 
                : '<option value="" disabled selected>ไม่มีข้อมูลชุดผู้รับเหมาในระบบ</option>';
            document.getElementById('inpContractor').innerHTML = contractorHtml;
            document.getElementById('editInpContractor').innerHTML = contractorHtml;
        }

        function updateContractorFilter(data) {
            const select = document.getElementById('filterContractor');
            const currentValue = select.value;
            const contractors = [...new Set(data.map(item => String(item.contractorGroup || '').trim()).filter(c => c !== ''))].sort();
            
            let html = '<option value="all">ทุกชุดผู้รับเหมา</option>';
            contractors.forEach(c => {
                html += `<option value="${c}">${c}</option>`;
            });
            select.innerHTML = html;
            if (contractors.includes(currentValue)) { select.value = currentValue; }
        }

        function processData(data) {
            updateDashboardCards(data);
            updateContractorFilter(data);
            currentFilteredData = data; 
            renderTable(data);
            initOrUpdateChart(data);
        }

        function updateDashboardCards(data) {
            const total = data.length;
            const trainedCount = data.filter(d => String(d.trainStatus).includes('อบรมแล้ว')).length;
            const waitingCount = total - trainedCount;

            animateValue("dashTotal", total);
            animateValue("dashTrained", trainedCount);
            animateValue("dashWaiting", waitingCount);

            // คำนวณสถานะทำบัตร
            const cardDoneCount = data.filter(d => String(d.cardStatus).includes('ทำบัตรแล้ว')).length;
            const cardWaitCount = total - cardDoneCount;
            animateValue("dashCardDone", cardDoneCount);
            animateValue("dashCardWait", cardWaitCount);

            // คำนวณสถานะรับบัตร
            const receiveDoneCount = data.filter(d => String(d.cardReceiveStatus).includes('รับแล้ว')).length;
            const receiveWaitCount = total - receiveDoneCount;
            animateValue("dashReceiveDone", receiveDoneCount);
            animateValue("dashReceiveWait", receiveWaitCount);

            // สรุปข้อมูลพนักงานแยกตามชุดผู้รับเหมา
            const contractorCounts = {};
            data.forEach(d => {
                const group = String(d.contractorGroup || '').trim();
                const safeGroup = (group === '' || group === '-') ? 'ไม่มีสังกัด / พนักงานประจำ' : group;
                contractorCounts[safeGroup] = (contractorCounts[safeGroup] || 0) + 1;
            });

            const contractorListContainer = document.getElementById('contractorSummaryList');
            if (contractorListContainer) {
                contractorListContainer.innerHTML = '';
                const sortedContractors = Object.entries(contractorCounts).sort((a, b) => b[1] - a[1]);

                sortedContractors.forEach(([group, count]) => {
                    const percent = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                    contractorListContainer.innerHTML += `
                        <div class="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-indigo-50/50 transition-colors">
                            <div class="flex justify-between items-start gap-2">
                                <span class="text-xs sm:text-sm font-bold text-gray-700 leading-tight">${group}</span>
                                <span class="text-sm sm:text-base font-extrabold text-brand-purple shrink-0">${count} <span class="text-[10px] text-gray-500 font-normal">คน</span></span>
                            </div>
                            <div class="w-full bg-gray-200 h-1.5 rounded-full mt-auto overflow-hidden">
                                <div class="h-full bg-brand-lightPurple rounded-full" style="width: ${percent}%"></div>
                            </div>
                        </div>
                    `;
                });
                
                if (sortedContractors.length === 0) {
                     contractorListContainer.innerHTML = '<div class="text-xs text-gray-400 col-span-full py-4 text-center">ยังไม่มีข้อมูลในระบบ</div>';
                }
            }

            const trainedPercent = total > 0 ? (trainedCount / total) * 100 : 0;
            const waitingPercent = total > 0 ? (waitingCount / total) * 100 : 0;
            
            setTimeout(() => {
                const barTrained = document.getElementById('barTrained');
                const barWaiting = document.getElementById('barWaiting');
                const pTrained = document.getElementById('percentTrained');
                if(barTrained) barTrained.style.width = `${trainedPercent}%`;
                if(barWaiting) barWaiting.style.width = `${waitingPercent}%`;
                if(pTrained) pTrained.innerText = `${Math.round(trainedPercent)}%`;
            }, 300);
        }

        function renderTable(dataToRender) {
            const tbody = document.getElementById('employeeTableBody');
            const noDataMsg = document.getElementById('noDataMessage');
            
            tbody.innerHTML = '';
            
            if (dataToRender.length === 0) {
                noDataMsg.classList.remove('hidden');
                document.getElementById('tableSummaryText').innerText = `ไม่พบข้อมูล`;
                return;
            } else {
                noDataMsg.classList.add('hidden');
                document.getElementById('tableSummaryText').innerText = `แสดงข้อมูล ${dataToRender.length} รายการ`;
            }

            dataToRender.forEach((row, index) => {
                // ... (สถานะ badges เหมือนเดิม) ...
                let docBadge = '';
                const docStatus = String(row.documentStatus || '').trim();
                if (docStatus === 'ครบ') docBadge = `<span class="px-2 md:px-3 py-1 inline-flex text-[10px] md:text-[11px] font-bold rounded-full bg-green-50 text-green-600 border border-green-100">${docStatus}</span>`;
                else if (docStatus.includes('ขาด') || docStatus === 'ไม่ครบ') docBadge = `<span class="px-2 md:px-3 py-1 inline-flex text-[10px] md:text-[11px] font-bold rounded-full bg-red-50 text-red-600 border border-red-100">${docStatus}</span>`;
                else docBadge = `<span class="text-[10px] md:text-xs text-gray-500">${docStatus || '-'}</span>`;

                let trainBadge = '';
                const tStatus = String(row.trainStatus).trim();
                if (tStatus.includes('อบรมแล้ว')) trainBadge = `<span class="px-2 md:px-3 py-1 inline-flex text-[10px] md:text-[11px] font-bold rounded-full bg-green-50 text-green-600 border border-green-100">${tStatus}</span>`;
                else if (tStatus.includes('รอ')) trainBadge = `<span class="px-2 md:px-3 py-1 inline-flex text-[10px] md:text-[11px] font-bold rounded-full bg-orange-50 text-brand-orange border border-orange-100">${tStatus}</span>`;
                else trainBadge = `<span class="text-[10px] md:text-xs text-gray-500">${tStatus || '-'}</span>`;

                let cardBadge = '';
                const cStatus = String(row.cardStatus).trim();
                if (cStatus === 'ทำบัตรแล้ว') cardBadge = `<div class="bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-md text-[10px] md:text-[11px] font-bold w-full max-w-[90px] md:max-w-[100px] mx-auto flex items-center justify-between shadow-sm"><span>${cStatus}</span> <i class="ph-fill ph-caret-down text-[9px] md:text-[10px]"></i></div>`;
                else if (cStatus.includes('รอ') || cStatus === 'ยังไม่ทำ') cardBadge = `<div class="bg-[#A01515] border border-red-800 text-white px-2 py-1 rounded-md text-[10px] md:text-[11px] font-bold w-full max-w-[90px] md:max-w-[100px] mx-auto flex items-center justify-between shadow-sm"><span>${cStatus}</span> <i class="ph-fill ph-caret-down text-[9px] md:text-[10px] text-red-200"></i></div>`;
                else cardBadge = `<span class="text-[10px] md:text-xs text-gray-500">${cStatus || '-'}</span>`;

                let receiveBadge = '';
                const rStatus = String(row.cardReceiveStatus || '').trim();
                if (rStatus === 'รับแล้ว') receiveBadge = `<div class="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-md text-[10px] md:text-[11px] font-bold w-full max-w-[80px] md:max-w-[90px] mx-auto flex items-center justify-center shadow-sm"><span>${rStatus}</span></div>`;
                else if (rStatus.includes('ยังไม่รับ') || rStatus === 'รอรับบัตร') receiveBadge = `<div class="bg-gray-100 border border-gray-300 text-gray-500 px-2 py-1 rounded-md text-[10px] md:text-[11px] font-bold w-full max-w-[80px] md:max-w-[90px] mx-auto flex items-center justify-center shadow-sm"><span>${rStatus}</span></div>`;
                else receiveBadge = `<span class="text-[10px] md:text-xs text-gray-400">${rStatus || '-'}</span>`;

                let displayTrainDate = row.trainDate || 'ไม่ระบุ';
                if (displayTrainDate !== 'ไม่ระบุ' && displayTrainDate !== '-') {
                    if (String(displayTrainDate).includes('T')) {
                        const d = new Date(displayTrainDate);
                        displayTrainDate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
                    }
                } else displayTrainDate = '<span class="text-gray-400 font-normal">ไม่ระบุ</span>';

                let displayDob = row.birthDate || '-';
                if (String(displayDob).includes('T')) {
                    const d = new Date(displayDob);
                    displayDob = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
                }

                // การแสดงรูปขนาดย่อในตาราง
                let imageThumbnail = '';
                if (row.imageUrl && row.imageUrl !== "" && row.imageUrl !== "-") {
                    imageThumbnail = `<img src="${row.imageUrl}" class="w-8 h-8 rounded-full object-cover mx-auto shadow-sm" alt="profile">`;
                } else {
                    let initial = String(row.name).replace('นาย ', '').replace('นางสาว ', '').replace('นาง ', '').charAt(0) || 'U';
                    imageThumbnail = `<div class="w-8 h-8 rounded-full bg-brand-lightPurple/20 text-brand-purple flex items-center justify-center font-bold text-xs mx-auto">${initial}</div>`;
                }
                
                const safeIdCard = row.idCard && row.idCard !== 'undefined' ? row.idCard : '-';
                const safeContractor = row.contractorGroup && row.contractorGroup !== 'undefined' ? row.contractorGroup : '-';

                const tr = document.createElement('tr');
                tr.className = "hover:bg-brand-bg transition-colors duration-200 group cursor-pointer";
                tr.onclick = () => showEmployeeDetails(row, displayTrainDate, displayDob, trainBadge, cardBadge, receiveBadge, docBadge);
                tr.innerHTML = `
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-center">${imageThumbnail}</td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap"><div class="font-bold text-gray-800 group-hover:text-brand-purple transition-colors truncate max-w-[120px] md:max-w-none break-words whitespace-normal leading-tight">${row.name || '-'}</div></td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-gray-600 font-mono tracking-wider">${safeIdCard}</td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-gray-600 font-medium truncate max-w-[100px] md:max-w-none break-words whitespace-normal leading-tight">${row.position || '-'}</td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-gray-600 break-words whitespace-normal leading-tight">${row.group || '-'}</td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-center">${docBadge}</td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-center">${trainBadge}</td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-center">${cardBadge}</td>
                    <td class="py-2.5 md:py-3 px-3 md:px-4 whitespace-nowrap text-center text-gray-600 break-words whitespace-normal leading-tight">${safeContractor}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        function initOrUpdateChart(data) {
            const total = data.length;
            const trainedCount = data.filter(d => String(d.trainStatus).includes('อบรมแล้ว')).length;
            const waitingCount = total - trainedCount;
            const ctx = document.getElementById('statusChart').getContext('2d');
            
            if (donutChartInstance) {
                donutChartInstance.data.datasets[0].data = [trainedCount, waitingCount];
                donutChartInstance.update();
            } else {
                donutChartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: { labels: ['อบรมแล้ว', 'รออบรม'], datasets: [{ data: [trainedCount, waitingCount], backgroundColor: ['#5E64D1', '#F48962'], borderWidth: 3, borderColor: '#FFFFFF', hoverOffset: 4 }] },
                    options: { responsive: true, maintainAspectRatio: false, cutout: '72%', plugins: { legend: { display: false } }, animation: { animateScale: true, animateRotate: true } }
                });
            }
        }

        // ==========================================
        // 4. ระบบกรอง (Filter) , คำนวณอายุ & ส่งออก Excel
        // ==========================================
        function filterTable() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            // ตัดช่องว่างออกทั้งหมดสำหรับการค้นหาชื่อ
            const searchText = searchInput.replace(/\s+/g, '');
            // ตัดช่องว่างและขีดออกทั้งหมดสำหรับการค้นหาด้วยเลขบัตร
            const searchIdText = searchInput.replace(/[\s\-]/g, '');

            const statusFilter = document.getElementById('filterStatus').value;
            const contractorFilter = document.getElementById('filterContractor').value;
            
            const filteredData = localData.filter(row => {
                // ข้อมูลจากฐานข้อมูลก็ทำการตัดช่องว่าง/ขีด ออกก่อนเปรียบเทียบเช่นกัน
                const name = String(row.name || '').toLowerCase().replace(/\s+/g, '');
                const id = String(row.idCard || '').toLowerCase().replace(/[\s\-]/g, '');
                
                const matchText = name.includes(searchText) || id.includes(searchIdText);
                
                let matchStatus = true;
                if (statusFilter !== 'all') {
                    const tStatus = String(row.trainStatus).trim();
                    if (statusFilter === 'อบรมแล้ว') matchStatus = tStatus.includes('อบรมแล้ว');
                    else if (statusFilter === 'รออบรม') matchStatus = tStatus.includes('รอ');
                }

                let matchContractor = true;
                if (contractorFilter !== 'all') matchContractor = String(row.contractorGroup).trim() === contractorFilter;
                
                return matchText && matchStatus && matchContractor;
            });
            
            currentFilteredData = filteredData; 
            renderTable(filteredData);
        }

        const EXPORT_COL_OPTIONS = [
            { id: 'exp_no', label: 'ลำดับ', width: 8, checked: true },
            { id: 'exp_sysno', label: 'รหัสในระบบ', width: 12, checked: false }, 
            { id: 'exp_name', label: 'ชื่อ-นามสกุล', width: 30, checked: true },
            { id: 'exp_idcard', label: 'เลขบัตรประชาชน', width: 22, checked: true },
            { id: 'exp_position', label: 'ตำแหน่ง', width: 25, checked: true },
            { id: 'exp_group', label: 'สังกัดชุด', width: 25, checked: true },
            { id: 'exp_contractor', label: 'ชุดผู้รับเหมา', width: 25, checked: true },
            { id: 'exp_dob', label: 'วัน/เดือน/ปีเกิด', width: 15, checked: true },
            { id: 'exp_age', label: 'อายุ', width: 8, checked: true },
            { id: 'exp_doc', label: 'สถานะเอกสาร', width: 15, checked: true },
            { id: 'exp_train', label: 'สถานะการอบรม', width: 18, checked: true },
            { id: 'exp_traindate', label: 'วันที่อบรม', width: 15, checked: true },
            { id: 'exp_card', label: 'สถานะการทำบัตร', width: 18, checked: true },
            { id: 'exp_receive', label: 'สถานะการรับบัตร', width: 18, checked: true }
        ];

        function openExportModal() {
            if (!currentFilteredData || currentFilteredData.length === 0) {
                showToast('ไม่มีข้อมูล', 'ไม่พบข้อมูลที่ตรงกับเงื่อนไขสำหรับการส่งออก', 'error');
                return;
            }
            const container = document.getElementById('exportColsContainer');
            container.innerHTML = '';
            EXPORT_COL_OPTIONS.forEach(col => {
                container.innerHTML += `
                    <label class="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors shadow-sm">
                        <input type="checkbox" value="${col.id}" ${col.checked ? 'checked' : ''} class="export-col-cb w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500">
                        <span class="text-sm text-gray-700 font-bold">${col.label}</span>
                    </label>
                `;
            });
            const modal = document.getElementById('exportModal');
            const content = document.getElementById('exportModalContent');
            modal.classList.remove('hidden');
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            });
        }

        function closeExportModal() {
            const modal = document.getElementById('exportModal');
            const content = document.getElementById('exportModalContent');
            modal.classList.add('opacity-0');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }

        function toggleAllExportCols() {
            const cbs = document.querySelectorAll('.export-col-cb');
            const btn = document.getElementById('btnToggleExportCols');
            const isSelectAll = btn.innerText === 'เลือกทั้งหมด';
            cbs.forEach(cb => cb.checked = isSelectAll);
            btn.innerText = isSelectAll ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด';
        }

        function exportToExcel() {
            const cbs = document.querySelectorAll('.export-col-cb:checked');
            if (cbs.length === 0) {
                showToast('คำเตือน', 'กรุณาเลือกอย่างน้อย 1 คอลัมน์', 'error');
                return;
            }
            const selectedIds = Array.from(cbs).map(cb => cb.value);
            EXPORT_COL_OPTIONS.forEach(col => { col.checked = selectedIds.includes(col.id); });

            closeExportModal();
            showGlobalLoading(true, "กำลังเตรียมไฟล์ Excel", "กรุณารอสักครู่ ระบบกำลังสร้างไฟล์ข้อมูล...");

            setTimeout(() => {
                try {
                    const workbook = XLSX.utils.book_new();

                    const createStyledWorksheet = (dataArray) => {
                        const exportData = dataArray.map((row, index) => {
                            let displayTrainDate = row.trainDate || 'ไม่ระบุ';
                            if (displayTrainDate !== 'ไม่ระบุ' && displayTrainDate !== '-') {
                                if (String(displayTrainDate).includes('T')) {
                                    const d = new Date(displayTrainDate);
                                    displayTrainDate = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
                                }
                            } else displayTrainDate = 'ไม่ระบุ';

                            let displayDob = row.birthDate || '-';
                            if (String(displayDob).includes('T')) {
                                const d = new Date(displayDob);
                                displayDob = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
                            }

                            let idCardText = String(row.idCard || '-').trim();
                            if (idCardText !== '-' && idCardText !== 'undefined') {
                                let digitsOnly = idCardText.replace(/\D/g, '');
                                if (digitsOnly.length === 13) idCardText = `${digitsOnly[0]}-${digitsOnly.substring(1,5)}-${digitsOnly.substring(5,10)}-${digitsOnly.substring(10,12)}-${digitsOnly[12]}`;
                                else if (/^\d+$/.test(idCardText)) idCardText = '\u200B' + idCardText;
                            }

                            const rowData = {};
                            if (selectedIds.includes('exp_no')) rowData['ลำดับ'] = index + 1;
                            if (selectedIds.includes('exp_sysno')) rowData['รหัสในระบบ'] = row.no || '-';
                            if (selectedIds.includes('exp_name')) rowData['ชื่อ-นามสกุล'] = row.name || '-';
                            if (selectedIds.includes('exp_idcard')) rowData['เลขบัตรประชาชน'] = idCardText;
                            if (selectedIds.includes('exp_position')) rowData['ตำแหน่ง'] = row.position || '-';
                            if (selectedIds.includes('exp_group')) rowData['สังกัดชุด'] = row.group || '-';
                            if (selectedIds.includes('exp_contractor')) rowData['ชุดผู้รับเหมา'] = row.contractorGroup || '-';
                            if (selectedIds.includes('exp_dob')) rowData['วัน/เดือน/ปีเกิด'] = displayDob;
                            if (selectedIds.includes('exp_age')) rowData['อายุ'] = row.age || '-';
                            if (selectedIds.includes('exp_doc')) rowData['สถานะเอกสาร'] = row.documentStatus || '-';
                            if (selectedIds.includes('exp_train')) rowData['สถานะการอบรม'] = row.trainStatus || '-';
                            if (selectedIds.includes('exp_traindate')) rowData['วันที่อบรม'] = displayTrainDate;
                            if (selectedIds.includes('exp_card')) rowData['สถานะการทำบัตร'] = row.cardStatus || '-';
                            if (selectedIds.includes('exp_receive')) rowData['สถานะการรับบัตร'] = row.cardReceiveStatus || '-';
                            return rowData;
                        });

                        const worksheet = XLSX.utils.json_to_sheet(exportData);
                        const wscols = [];
                        EXPORT_COL_OPTIONS.forEach(col => { if (selectedIds.includes(col.id)) wscols.push({wch: col.width}); });
                        worksheet['!cols'] = wscols;

                        const nameIndex = selectedIds.indexOf('exp_name');
                        const range = XLSX.utils.decode_range(worksheet['!ref']);
                        for (let R = range.s.r; R <= range.e.r; ++R) {
                            for (let C = range.s.c; C <= range.e.c; ++C) {
                                const cellRef = XLSX.utils.encode_cell({c: C, r: R});
                                if (!worksheet[cellRef]) continue;

                                let cellStyle = {
                                    alignment: { vertical: "center", horizontal: "center" },
                                    border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } } },
                                    font: { name: "Arial", sz: 11 }
                                };

                                if (R === 0) {
                                    cellStyle.font.bold = true;
                                    cellStyle.fill = { fgColor: { rgb: "D9D9D9" } };
                                } else {
                                    if (C === nameIndex) cellStyle.alignment.horizontal = "left";
                                }
                                worksheet[cellRef].s = cellStyle;
                            }
                        }
                        return worksheet;
                    };

                    const statusFilter = document.getElementById('filterStatus').value;
                    const contractorFilter = document.getElementById('filterContractor').value;

                    if (statusFilter === 'all' && contractorFilter === 'all') {
                        const wsAll = createStyledWorksheet(currentFilteredData);
                        XLSX.utils.book_append_sheet(workbook, wsAll, "รวมทั้งหมด");

                        const groupedData = {};
                        currentFilteredData.forEach(row => {
                            const groupName = (row.contractorGroup && row.contractorGroup.trim() !== '') ? row.contractorGroup.trim() : 'ไม่มีสังกัด';
                            if (!groupedData[groupName]) groupedData[groupName] = [];
                            groupedData[groupName].push(row);
                        });

                        const usedSheetNames = new Set();
                        usedSheetNames.add("รวมทั้งหมด"); 

                        Object.keys(groupedData).sort().forEach(groupName => {
                            const wsGroup = createStyledWorksheet(groupedData[groupName]);
                            let safeName = groupName.replace(/[\/*?:\[\]]/g, '').trim();
                            if (!safeName) safeName = 'ไม่มีสังกัด';
                            safeName = safeName.substring(0, 28);
                            let finalName = safeName;
                            let counter = 1;
                            while (usedSheetNames.has(finalName.toLowerCase())) {
                                finalName = `${safeName.substring(0, 25)}_${counter}`;
                                counter++;
                            }
                            usedSheetNames.add(finalName.toLowerCase()); 
                            XLSX.utils.book_append_sheet(workbook, wsGroup, finalName);
                        });
                    } else {
                        const wsSingle = createStyledWorksheet(currentFilteredData);
                        XLSX.utils.book_append_sheet(workbook, wsSingle, "Employee Data");
                    }

                    const today = new Date();
                    const dateStr = `${today.getFullYear()}${(today.getMonth()+1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
                    const fileName = `SUNWORK_Employees_${dateStr}.xlsx`;
                    XLSX.writeFile(workbook, fileName);

                    showGlobalLoading(false);
                    showToast('ส่งออกสำเร็จ', 'ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว', 'success');
                } catch (error) {
                    console.error("Export to Excel Error: ", error);
                    showGlobalLoading(false);
                    showToast('เกิดข้อผิดพลาด', 'ไม่สามารถส่งออกไฟล์ Excel ได้', 'error');
                }
            }, 600); 
        }

        function autoCalcAge() {
            const dobInput = document.getElementById('inpDob').value;
            if (dobInput) {
                const birthDate = new Date(dobInput);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                document.getElementById('inpAge').value = age + " ปี";
            } else {
                document.getElementById('inpAge').value = "";
            }
        }

        function autoCalcAgeEdit() {
            const dobInput = document.getElementById('editInpDob').value;
            if (dobInput) {
                const birthDate = new Date(dobInput);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
                document.getElementById('editInpAge').value = age + " ปี";
            } else {
                document.getElementById('editInpAge').value = "";
            }
        }

        function formatDobForSheet(dateStr) {
            if(!dateStr) return "";
            const [y, m, d] = dateStr.split('-');
            return `${parseInt(d)}/${parseInt(m)}/${y}`; 
        }

        function formatTrainDateForSheet(dateStr) {
            if(!dateStr) return "ไม่ระบุ";
            if (dateStr.includes('-')) {
                const [y, m, d] = dateStr.split('-');
                return `${parseInt(d)}/${parseInt(m)}/${y}`; 
            }
            return dateStr;
        }

        function ensureOptionExists(selectId, value) {
            if (!value || value === 'undefined') return;
            const select = document.getElementById(selectId);
            if (!Array.from(select.options).some(o => o.value === value)) {
                select.innerHTML += `<option value="${value}">${value}</option>`;
            }
            select.value = value;
        }

        function resetFormState() {
            document.getElementById('employeeDataForm').reset();
            document.getElementById('inpAge').value = "";
            
            // รีเซ็ตรูปภาพ
            document.getElementById('inpProfileImage').value = "";
            document.getElementById('profileImagePreview').classList.add('hidden');
            document.getElementById('profileImagePreview').src = "";
            document.getElementById('profileImagePlaceholder').classList.remove('hidden');
        }

        // ==========================================
        // 5. ฟังก์ชันบันทึกข้อมูล (POST) พร้อมอัปโหลดรูป
        // ==========================================
        
        async function submitForm(e) {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('btnSubmit');
            const originalHTML = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="ph ph-spinner animate-spin text-xl"></i> <span>กำลังดำเนินการ...</span>';
            btnSubmit.disabled = true;
            btnSubmit.classList.add('opacity-75', 'cursor-not-allowed');

            try {
                if (WEB_APP_URL === "") {
                    showToast('ข้อผิดพลาด', 'ยังไม่ได้ตั้งค่า WEB_APP_URL ในระบบ', 'error');
                    resetBtn();
                    return;
                }

                let finalImageUrl = "";
                const imageFile = document.getElementById('inpProfileImage').files[0];
                
                if (imageFile) {
                    showGlobalLoading(true, "กำลังอัปโหลดรูปภาพ", "กรุณารอสักครู่ ระบบกำลังนำส่งรูปภาพ...");
                    finalImageUrl = await uploadImageToCloudinary(imageFile);
                    showGlobalLoading(true, "กำลังบันทึกข้อมูล", "กำลังบันทึกข้อมูลพนักงานเข้าสู่ฐานระบบ");
                }

                const rawDob = document.getElementById('inpDob').value;
                const rawTrainDate = document.getElementById('inpTrainDate').value;

                // แก้ไขปัญหา Number การรัน ID ให้ปลอดภัย
                let newNo = 1;
                if (localData && localData.length > 0) {
                    const allIds = localData.map(d => parseInt(d.no) || 0);
                    newNo = Math.max(...allIds) + 1;
                }

                const newData = {
                    action: 'add',
                    no: newNo,
                    name: document.getElementById('inpName').value,
                    idCard: document.getElementById('inpId').value,
                    position: document.getElementById('inpPos').value,
                    group: document.getElementById('inpGroup').value,
                    documentStatus: document.getElementById('inpDocStatus').value, 
                    trainStatus: document.getElementById('inpTrain').value,        
                    trainDate: formatTrainDateForSheet(rawTrainDate),      
                    cardStatus: document.getElementById('inpCard').value,          
                    birthDate: formatDobForSheet(rawDob),                          
                    age: document.getElementById('inpAge').value,                  
                    cardReceiveStatus: document.getElementById('inpCardReceive').value, 
                    contractorGroup: document.getElementById('inpContractor').value,
                    imageUrl: finalImageUrl // ส่ง URL รูปไปด้วย
                };

                const formData = new URLSearchParams();
                for (const key in newData) { formData.append(key, newData[key]); }

                const response = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    body: formData
                });
                
                if(response.ok) {
                    await fetchData(); 
                    showToast('บันทึกข้อมูลสำเร็จ', 'ข้อมูลถูกเพิ่มเข้าสู่ระบบแล้ว', 'success');
                    resetFormState(); 
                    resetBtn();
                    showGlobalLoading(false);
                    setTimeout(() => switchTab('employee-list'), 1000);
                } else {
                    throw new Error("POST Error");
                }
            } catch (error) {
                console.error('Submit Error:', error);
                showGlobalLoading(false);
                showToast('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้ โปรดตรวจสอบการตั้งค่า Cloudinary หรืออินเทอร์เน็ต', 'error');
                resetBtn();
            }

            function resetBtn() {
                btnSubmit.innerHTML = originalHTML;
                btnSubmit.disabled = false;
                btnSubmit.classList.remove('opacity-75', 'cursor-not-allowed');
            }
        }

        async function submitModalEdit(e) {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('btnModalSubmit');
            const originalHTML = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<i class="ph ph-spinner animate-spin text-lg"></i> บันทึก...';
            btnSubmit.disabled = true;

            try {
                let finalImageUrl = currentEditImageUrl; // ใช้รูปเดิมไว้ก่อน
                const newImageFile = document.getElementById('editInpProfileImage').files[0];

                if (newImageFile) {
                    showGlobalLoading(true, "กำลังอัปโหลดรูปภาพใหม่", "กรุณารอสักครู่ ระบบกำลังนำส่งรูปภาพ...");
                    finalImageUrl = await uploadImageToCloudinary(newImageFile);
                    showGlobalLoading(true, "กำลังบันทึกการแก้ไข", "รอสักครู่...");
                } else {
                    showGlobalLoading(true, "กำลังบันทึกการแก้ไข", "รอสักครู่...");
                }

                const rawDob = document.getElementById('editInpDob').value;
                const rawEditTrainDate = document.getElementById('editInpTrainDate').value;

                const newData = {
                    action: 'edit',
                    no: currentEditNo,
                    name: document.getElementById('editInpName').value,
                    idCard: document.getElementById('editInpId').value,
                    position: document.getElementById('editInpPos').value,
                    group: document.getElementById('editInpGroup').value,
                    documentStatus: document.getElementById('editInpDocStatus').value, 
                    trainStatus: document.getElementById('editInpTrain').value,        
                    trainDate: formatTrainDateForSheet(rawEditTrainDate),      
                    cardStatus: document.getElementById('editInpCard').value,          
                    birthDate: formatDobForSheet(rawDob),                          
                    age: document.getElementById('editInpAge').value,                  
                    cardReceiveStatus: document.getElementById('editInpCardReceive').value, 
                    contractorGroup: document.getElementById('editInpContractor').value,
                    imageUrl: finalImageUrl // อัปเดต URL รูป 
                };

                const formData = new URLSearchParams();
                for (const key in newData) { formData.append(key, newData[key]); }

                const response = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    body: formData
                });
                
                if(response.ok) {
                    await fetchData(); 
                    showToast('อัปเดตสำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success');
                    closeDetailsModal();
                } else {
                    throw new Error("POST Error");
                }
            } catch (error) {
                console.error('Submit Error:', error);
                showToast('เกิดข้อผิดพลาด', 'ไม่สามารถแก้ไขข้อมูลได้', 'error');
            } finally {
                showGlobalLoading(false);
                btnSubmit.innerHTML = originalHTML;
                btnSubmit.disabled = false;
            }
        }

        // ==========================================
        // 6. Utility Functions (Tabs & UI)
        // ==========================================
        function switchTab(tab) {
            const views = ['dashboard', 'employee-list', 'form'];
            views.forEach(v => {
                document.getElementById(`${v}-view`).classList.add('hidden');
                const nav = document.getElementById(`nav-${v}`);
                if(nav) {
                    nav.classList.remove('text-white');
                    nav.classList.add('text-brand-lightPurple');
                    nav.querySelectorAll('.nav-indicator').forEach(el => el.classList.replace('opacity-100', 'opacity-0'));
                    const icon = nav.querySelector('.nav-icon');
                    icon.classList.remove('ph-fill'); icon.classList.add('ph');
                }
            });

            document.getElementById(`${tab}-view`).classList.remove('hidden');
            if (tab === 'dashboard') document.getElementById('dashboard-view').classList.add('flex');

            const activeNav = document.getElementById(`nav-${tab}`);
            if(activeNav) {
                activeNav.classList.remove('text-brand-lightPurple');
                activeNav.classList.add('text-white');
                activeNav.querySelectorAll('.nav-indicator').forEach(el => el.classList.replace('opacity-0', 'opacity-100'));
                const activeIcon = activeNav.querySelector('.nav-icon');
                activeIcon.classList.remove('ph'); activeIcon.classList.add('ph-fill');
            }
        }

        function showToast(title, message, type = 'success') {
            const toast = document.getElementById('toast');
            const icon = document.getElementById('toastIcon');
            const iconBg = document.getElementById('toastIconBg');
            
            document.getElementById('toastTitle').innerText = title;
            document.getElementById('toastMsg').innerText = message;

            if (type === 'success') {
                toast.classList.add('border-green-500'); toast.classList.remove('border-red-500');
                iconBg.classList.add('bg-green-100'); iconBg.classList.remove('bg-red-100');
                icon.className = 'ph-fill ph-check-circle text-green-500 text-xl md:text-2xl';
            } else {
                toast.classList.remove('border-green-500'); toast.classList.add('border-red-500');
                iconBg.classList.remove('bg-green-100'); iconBg.classList.add('bg-red-100');
                icon.className = 'ph-fill ph-x-circle text-red-500 text-xl md:text-2xl';
            }
            
            toast.classList.remove('opacity-0', 'scale-90', 'pointer-events-none');
            setTimeout(() => { toast.classList.add('opacity-0', 'scale-90', 'pointer-events-none'); }, 3500);
        }

        function animateValue(id, end, duration = 1000) {
            const obj = document.getElementById(id);
            if(!obj) return;
            const start = parseInt(obj.innerText) || 0;
            if (start === end) return;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
                if (progress < 1) window.requestAnimationFrame(step);
                else obj.innerHTML = end;
            };
            window.requestAnimationFrame(step);
        }

        // ==========================================
        // 7. ฟังก์ชันสำหรับ OCR (สแกนบัตร) ด้วย Image Preprocessing
        // ==========================================
        function showGlobalLoading(show, title = "กำลังทำงาน", subtitle = "กรุณารอสักครู่...") {
            const modal = document.getElementById('globalLoading');
            const content = document.getElementById('globalLoadingContent');
            
            document.getElementById('loadingTitle').innerText = title;
            document.getElementById('loadingSubtitle').innerText = subtitle;
            
            if (show) {
                modal.classList.remove('hidden');
                requestAnimationFrame(() => {
                    modal.classList.remove('opacity-0');
                    content.classList.remove('scale-95');
                    content.classList.add('scale-100');
                });
            } else {
                modal.classList.add('opacity-0');
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        }

        function preprocessImageForOCR(file) {
            return new Promise((resolve) => {
                const img = new Image();
                const url = URL.createObjectURL(file);
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const maxWidth = 1200;
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;
                    const contrast = 70; 
                    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
                    
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i]; const g = data[i + 1]; const b = data[i + 2];
                        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                        let newColor = factor * (gray - 128) + 128;
                        newColor = Math.max(0, Math.min(255, newColor));
                        data[i] = data[i + 1] = data[i + 2] = newColor;
                    }
                    
                    ctx.putImageData(imgData, 0, 0);
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                };
                img.src = url;
            });
        }

        async function processIdCard(input) {
            const file = input.files[0];
            if (!file) return;

            showGlobalLoading(true, "กำลังสแกนบัตรประชาชน", "ระบบ AI กำลังปรับแต่งภาพและอ่านข้อมูล\nกระบวนการนี้อาจใช้เวลา 3-10 วินาที");

            try {
                const processedImageData = await preprocessImageForOCR(file);
                const worker = await Tesseract.createWorker('tha+eng');
                const ret = await worker.recognize(processedImageData);
                const text = ret.data.text;
                await worker.terminate();

                parseIdCardData(text);
            } catch (err) {
                console.error(err);
                showToast('สแกนล้มเหลว', 'ไม่สามารถอ่านข้อความจากรูปภาพได้ หรือรูปภาพไม่ชัดเจน', 'error');
            } finally {
                showGlobalLoading(false);
                input.value = ''; 
            }
        }

        function parseIdCardData(text) {
            let foundData = false;

            const idPattern = text.match(/([0-9]\s*){13}/);
            if (idPattern) {
                let digits = idPattern[0].replace(/\s/g, '');
                if (digits.length >= 13) {
                    digits = digits.substring(0, 13);
                    const idNum = `${digits[0]}-${digits.substring(1,5)}-${digits.substring(5,10)}-${digits.substring(10,12)}-${digits[12]}`;
                    document.getElementById('inpId').value = idNum;
                    foundData = true;
                }
            }

            const nameMatch = text.match(/(นาย|นางสาว|นาง|น\.ส\.|น\.ส|ด\.ช\.|ด\.ญ\.|uาย|หาง|บาง|หางสาว|บางสาว)\s*([ก-๙a-zA-Z]+)\s+([ก-๙a-zA-Z]+)/);
            if (nameMatch) {
                let title = nameMatch[1];
                if (['uาย'].includes(title)) title = 'นาย';
                if (['หาง', 'บาง'].includes(title)) title = 'นาง';
                if (['หางสาว', 'บางสาว', 'น.ส.', 'น.ส'].includes(title)) title = 'นางสาว';
                
                document.getElementById('inpName').value = `${title} ${nameMatch[2]} ${nameMatch[3]}`.replace(/\s+/g, ' ');
                foundData = true;
            }

            const dobMatch = text.match(/(?:เกิดวันที่|เกิด|Date of Birth|DOB|Birth)?\s*(\d{1,2})\s*([ก-๙a-zA-Z\.]+)\s*(\d{4})/);
            if (dobMatch) {
                let day = dobMatch[1].padStart(2, '0');
                let monthStr = dobMatch[2].replace(/\s/g, '');
                let year = parseInt(dobMatch[3]);

                if (year > 2400) year -= 543;

                const monthsMap = {
                    'ม.ค.': '01', 'มกราคม': '01', 'ม.ค': '01',
                    'ก.พ.': '02', 'กุมภาพันธ์': '02', 'ก.พ': '02',
                    'มี.ค.': '03', 'มีนาคม': '03', 'มี.ค': '03',
                    'เม.ย.': '04', 'เมษายน': '04', 'เม.ย': '04',
                    'พ.ค.': '05', 'พฤษภาคม': '05', 'พ.ค': '05', 'w.ค.': '05', 'w.ค': '05',
                    'มิ.ย.': '06', 'มิถุนายน': '06', 'มิ.ย': '06',
                    'ก.ค.': '07', 'กรกฎาคม': '07', 'ก.ค': '07',
                    'ส.ค.': '08', 'สิงหาคม': '08', 'ส.ค': '08',
                    'ก.ย.': '09', 'กันยายน': '09', 'ก.ย': '09',
                    'ต.ค.': '10', 'ตุลาคม': '10', 'ต.ค': '10',
                    'พ.ย.': '11', 'พฤศจิกายน': '11', 'พ.ย': '11',
                    'ธ.ค.': '12', 'ธันวาคม': '12', 'ธ.ค': '12'
                };
                
                let month = monthsMap[monthStr];
                
                if(!month) {
                     if(monthStr.includes('ม.ค') || monthStr.includes('มกรา')) month = '01';
                     else if(monthStr.includes('ก.พ') || monthStr.includes('กุมภา')) month = '02';
                     else if(monthStr.includes('มี.ค') || monthStr.includes('มีนา')) month = '03';
                     else if(monthStr.includes('เม.ย') || monthStr.includes('เมษา')) month = '04';
                     else if(monthStr.includes('พ.ค') || monthStr.includes('พฤษภา')) month = '05';
                     else if(monthStr.includes('มิ.ย') || monthStr.includes('มิถุนา')) month = '06';
                     else if(monthStr.includes('ก.ค') || monthStr.includes('กรกฎา')) month = '07';
                     else if(monthStr.includes('ส.ค') || monthStr.includes('สิงหา')) month = '08';
                     else if(monthStr.includes('ก.ย') || monthStr.includes('กันยา')) month = '09';
                     else if(monthStr.includes('ต.ค') || monthStr.includes('ตุลา')) month = '10';
                     else if(monthStr.includes('พ.ย') || monthStr.includes('พฤศจิกา')) month = '11';
                     else if(monthStr.includes('ธ.ค') || monthStr.includes('ธันวา')) month = '12';
                }

                if (month) {
                    document.getElementById('inpDob').value = `${year}-${month}-${day}`;
                    autoCalcAge(); 
                    foundData = true;
                }
            }

            if (foundData) {
                showToast('ดึงข้อมูลสำเร็จ', 'กรุณาตรวจสอบความถูกต้องของข้อมูลอีกครั้ง', 'success');
            } else {
                showToast('ไม่พบข้อมูล', 'ระบบไม่สามารถดึงข้อมูลจากรูปนี้ได้ โปรดถ่ายให้ชัดเจนหรือกรอกเอง', 'error');
            }
        }

        // ==========================================
        // 8. ฟังก์ชันสำหรับ Modal (แสดง/แก้ไข/ลบ ข้อมูล)
        // ==========================================
        function showEmployeeDetails(row, displayTrainDate, displayDob, trainBadge, cardBadge, receiveBadge, docBadge) {
            const modal = document.getElementById('detailsModal');
            const modalContent = document.getElementById('detailsModalContent');
            
            document.getElementById('detailsViewMode').classList.remove('hidden');
            document.getElementById('editViewMode').classList.add('hidden');
            document.getElementById('detailsModalTitle').innerHTML = '<i class="ph-fill ph-user-circle text-xl md:text-2xl"></i> รายละเอียดพนักงาน';

            const body = document.getElementById('detailsModalBody');
            const footer = document.getElementById('detailsModalFooter');

            let profileAvatarHtml = '';
            if (row.imageUrl && row.imageUrl !== "" && row.imageUrl !== "-") {
                profileAvatarHtml = `<img src="${row.imageUrl}" alt="profile" class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-lg shadow-brand-purple/20 shrink-0 border-2 border-white">`;
            } else {
                let initial = String(row.name || 'U').replace('นาย ', '').replace('นางสาว ', '').replace('นาง ', '').charAt(0) || 'U';
                profileAvatarHtml = `
                    <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-brand-purple to-brand-lightPurple flex items-center justify-center text-white font-bold text-2xl md:text-3xl shadow-lg shadow-brand-purple/20 shrink-0 border-2 border-white">
                        ${initial}
                    </div>`;
            }

            const safeIdCard = row.idCard && row.idCard !== 'undefined' ? row.idCard : '-';

            body.innerHTML = `
                <div class="flex items-center gap-4 md:gap-5 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-100">
                    ${profileAvatarHtml}
                    <div class="flex-1 min-w-0">
                        <h4 class="text-xl md:text-2xl font-extrabold text-gray-800 font-heading leading-tight truncate w-full break-words whitespace-normal">${row.name || '-'}</h4>
                        <div class="flex items-center gap-1.5 md:gap-2 mt-1 md:mt-1.5">
                            <i class="ph-fill ph-identification-card text-brand-purple text-lg"></i>
                            <span class="text-xs md:text-sm text-gray-600 font-mono tracking-wide">${safeIdCard}</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div class="space-y-3 md:space-y-4">
                        <h5 class="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-1.5"><i class="ph-fill ph-briefcase"></i> ข้อมูลการทำงาน</h5>
                        <div class="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-100 flex flex-col gap-1">
                            <span class="text-[10px] md:text-[11px] text-gray-500 font-bold">ตำแหน่ง (Position)</span>
                            <span class="text-sm md:text-base font-bold text-gray-800 break-words">${row.position || '-'}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-1">
                                <span class="text-[10px] md:text-[11px] text-gray-500 font-bold">สังกัด (Group)</span>
                                <span class="text-sm md:text-base font-bold text-gray-800 break-words whitespace-normal leading-tight">${row.group || '-'}</span>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-1">
                                <span class="text-[10px] md:text-[11px] text-gray-500 font-bold">ชุดผู้รับเหมา</span>
                                <span class="text-sm md:text-base font-bold text-gray-800 break-words whitespace-normal leading-tight">${row.contractorGroup || '-'}</span>
                            </div>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-100 flex flex-col gap-1">
                            <span class="text-[10px] md:text-[11px] text-gray-500 font-bold">อายุ / วันเกิด</span>
                            <span class="text-sm md:text-base font-bold text-gray-800">${row.age || '-'} <span class="text-gray-400 font-normal ml-1">(${displayDob})</span></span>
                        </div>
                    </div>

                    <div class="space-y-3 md:space-y-4">
                        <h5 class="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-3 flex items-center gap-1.5"><i class="ph-fill ph-shield-check"></i> สถานะต่างๆ</h5>
                        <div class="bg-brand-bg rounded-xl p-3 md:p-4 border border-brand-lightPurple/20 flex flex-col gap-2 md:gap-3">
                            <div class="flex justify-between items-center">
                                <span class="text-[11px] md:text-xs text-gray-600 font-bold">สถานะเอกสาร</span>
                                <div>${docBadge}</div>
                            </div>
                            <div class="flex justify-between items-center pt-2 border-t border-brand-lightPurple/20 mt-1">
                                <span class="text-[11px] md:text-xs text-gray-600 font-bold">การอบรมความปลอดภัย</span>
                                <div>${trainBadge}</div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[11px] md:text-xs text-gray-600 font-bold">วันที่อบรม</span>
                                <span class="text-sm md:text-base font-bold text-gray-800">${displayTrainDate}</span>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-3 md:p-4 border border-gray-200 flex flex-col gap-2 md:gap-3 shadow-sm">
                            <div class="flex justify-between items-center">
                                <span class="text-[11px] md:text-xs text-gray-600 font-bold">สถานะการทำบัตร</span>
                                <div class="w-auto">${cardBadge}</div>
                            </div>
                            <div class="flex justify-between items-center pt-2 md:pt-3 border-t border-gray-100">
                                <span class="text-[11px] md:text-xs text-gray-600 font-bold">สถานะการรับบัตร</span>
                                <div class="w-auto">${receiveBadge}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            footer.innerHTML = `
                <div class="flex flex-col-reverse md:flex-row w-full justify-end gap-2">
                    <button onclick="closeDetailsModal()" class="w-full md:w-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs md:text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                        ปิดหน้าต่าง
                    </button>
                    <div class="flex gap-2 w-full md:w-auto">
                        <button onclick="promptDeleteEmployee(${row.no})" class="flex-1 md:flex-none px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-full text-xs md:text-sm font-bold hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-1">
                            <i class="ph-bold ph-trash"></i> ลบ
                        </button>
                        <button onclick="editEmployee(${row.no})" class="flex-1 md:flex-none px-4 py-2.5 bg-brand-purple text-white border border-brand-purple rounded-full text-xs md:text-sm font-bold hover:bg-[#4C51B6] transition-colors shadow-sm flex items-center justify-center gap-1">
                            <i class="ph-bold ph-pencil-simple"></i> แก้ไข
                        </button>
                    </div>
                </div>
            `;

            modal.classList.remove('hidden');
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            });
        }

        function editEmployee(no) {
            const row = localData.find(r => r.no === no);
            if (!row) return;

            currentEditNo = no;
            currentEditImageUrl = row.imageUrl || ""; // จำค่า URL เก่าไว้
            
            // จัดการแสดงผลรูปในโหมด Edit
            document.getElementById('editInpProfileImage').value = ""; // เคลียร์ไฟล์ใหม่ที่อาจค้างอยู่
            if (currentEditImageUrl && currentEditImageUrl !== "-") {
                document.getElementById('editProfileImagePreview').src = currentEditImageUrl;
                document.getElementById('editProfileImagePreview').classList.remove('hidden');
                document.getElementById('editProfileImagePlaceholder').classList.add('hidden');
            } else {
                document.getElementById('editProfileImagePreview').src = "";
                document.getElementById('editProfileImagePreview').classList.add('hidden');
                document.getElementById('editProfileImagePlaceholder').classList.remove('hidden');
            }

            document.getElementById('editInpName').value = row.name || '';
            const safeIdCard = row.idCard && row.idCard !== 'undefined' ? row.idCard : '';
            document.getElementById('editInpId').value = safeIdCard;
            
            ensureOptionExists('editInpPos', row.position);
            ensureOptionExists('editInpGroup', row.group);
            ensureOptionExists('editInpContractor', row.contractorGroup);

            document.getElementById('editInpDocStatus').value = row.documentStatus || 'ครบ';
            document.getElementById('editInpTrain').value = row.trainStatus;
            
            let tDateStr = String(row.trainDate || '').trim();
            if (tDateStr && tDateStr !== '-' && tDateStr !== 'ไม่ระบุ' && tDateStr !== 'undefined') {
                if (tDateStr.includes('T')) {
                    const d = new Date(tDateStr);
                    document.getElementById('editInpTrainDate').value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                } else if (tDateStr.includes('/')) {
                    const parts = tDateStr.split('/');
                    if (parts.length === 3) document.getElementById('editInpTrainDate').value = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                } else if (tDateStr.includes('-')) {
                    document.getElementById('editInpTrainDate').value = tDateStr.substring(0, 10);
                } else document.getElementById('editInpTrainDate').value = '';
            } else document.getElementById('editInpTrainDate').value = '';
            
            document.getElementById('editInpCard').value = row.cardStatus;
            document.getElementById('editInpCardReceive').value = row.cardReceiveStatus || 'ยังไม่รับ';

            let dobStr = String(row.birthDate || '').trim();
            if (dobStr && dobStr !== '-' && dobStr !== 'undefined') {
                if (dobStr.includes('T')) {
                    const d = new Date(dobStr);
                    document.getElementById('editInpDob').value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                } else if (dobStr.includes('/')) {
                    const parts = dobStr.split('/');
                    if (parts.length === 3) document.getElementById('editInpDob').value = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                } else if (dobStr.includes('-')) {
                    document.getElementById('editInpDob').value = dobStr.substring(0, 10);
                } else document.getElementById('editInpDob').value = '';
            } else document.getElementById('editInpDob').value = '';
            
            document.getElementById('editInpAge').value = row.age || '';

            document.getElementById('detailsViewMode').classList.add('hidden');
            document.getElementById('editViewMode').classList.remove('hidden');
            document.getElementById('detailsModalTitle').innerHTML = '<i class="ph-bold ph-pencil-simple text-xl md:text-2xl"></i> แก้ไขข้อมูลพนักงาน';
        }

        function cancelEditMode() {
            document.getElementById('detailsViewMode').classList.remove('hidden');
            document.getElementById('editViewMode').classList.add('hidden');
            document.getElementById('detailsModalTitle').innerHTML = '<i class="ph-fill ph-user-circle text-xl md:text-2xl"></i> รายละเอียดพนักงาน';
        }

        function promptDeleteEmployee(no) {
            employeeToDeleteNo = no;
            closeDetailsModal(); 
            
            const modal = document.getElementById('deleteConfirmModal');
            const content = document.getElementById('deleteConfirmContent');
            
            modal.classList.remove('hidden');
            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95');
                content.classList.add('scale-100');
            });
        }

        function closeDeleteConfirmModal() {
            const modal = document.getElementById('deleteConfirmModal');
            const content = document.getElementById('deleteConfirmContent');

            modal.classList.add('opacity-0');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');

            setTimeout(() => {
                modal.classList.add('hidden');
                employeeToDeleteNo = null;
            }, 300);
        }

        async function executeDeleteEmployee() {
            if (!employeeToDeleteNo) return;
            const no = employeeToDeleteNo;

            closeDeleteConfirmModal();
            showGlobalLoading(true, "กำลังลบข้อมูล", "กรุณารอสักครู่ ระบบกำลังลบข้อมูลจากฐานข้อมูล");

            try {
                const formData = new URLSearchParams();
                formData.append('action', 'delete');
                formData.append('no', no);

                const response = await fetch(WEB_APP_URL, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showToast('ลบสำเร็จ', 'ข้อมูลถูกลบออกจากระบบแล้ว', 'success');
                    await fetchData(); 
                } else {
                    throw new Error("Delete failed");
                }
            } catch (error) {
                console.error(error);
                showToast('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้ โปรดตรวจสอบการเชื่อมต่อ', 'error');
            } finally {
                showGlobalLoading(false);
            }
        }

        function closeDetailsModal() {
            const modal = document.getElementById('detailsModal');
            const modalContent = document.getElementById('detailsModalContent');

            modal.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');

            setTimeout(() => {
                modal.classList.add('hidden');
                document.getElementById('detailsViewMode').classList.remove('hidden');
                document.getElementById('editViewMode').classList.add('hidden');
            }, 300);
        }

        document.getElementById('detailsModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeDetailsModal();
            }
        });

        document.getElementById('deleteConfirmModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeDeleteConfirmModal();
            }
        });
    </script>
</body>
</html>
