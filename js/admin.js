/* ═══════════════════════════════════════════
   ProjectsHub — Admin Dashboard JS
   Charts (ApexCharts) + Tables + Filtering
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Helpers ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    function formatCurrency(n) {
        return '₹' + n.toLocaleString('en-IN');
    }

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateDates(count, endDate) {
        const dates = [];
        const end = endDate ? new Date(endDate) : new Date();
        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(end);
            d.setDate(d.getDate() - i);
            dates.push(d);
        }
        return dates;
    }

    function formatDate(d) {
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function formatDateShort(d) {
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }

    // ── Chart Theme Defaults ──
    function getChartDefaults() {
        const isLight = document.body.classList.contains('light');
        return {
            chart: {
                toolbar: { show: false },
                fontFamily: 'Lexend Deca, sans-serif',
                background: 'transparent',
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 600,
                    dynamicAnimation: { speed: 400 }
                }
            },
            theme: { mode: isLight ? 'light' : 'dark' },
            grid: {
                borderColor: 'rgba(255,255,255,0.04)',
                strokeDashArray: 3,
                padding: { left: 8, right: 8 }
            },
            tooltip: {
                theme: isLight ? 'light' : 'dark',
                style: { fontSize: '12px' }
            }
        };
    }


    /* ═══════════════════════════════════════════
       DEMO DATA GENERATORS
       ═══════════════════════════════════════════ */

    // Website visitors data
    function genVisitorData(days) {
        const dates = generateDates(days);
        return {
            categories: dates.map(d => formatDateShort(d)),
            unique: dates.map(() => randomBetween(400, 1200)),
            returning: dates.map(() => randomBetween(100, 500))
        };
    }

    // Tools data
    const TOOLS = [
        { name: 'AI Chatbot', color: '#818cf8' },
        { name: 'Workshop Page', color: '#c084fc' },
        { name: 'Project Explorer', color: '#60a5fa' },
        { name: 'Social Share', color: '#34d399' },
        { name: 'Idea Modal', color: '#fbbf24' },
        { name: 'Contact Form', color: '#f87171' },
        { name: 'Portfolio', color: '#fb923c' },
        { name: 'Blog', color: '#2dd4bf' },
    ];

    function genToolsData() {
        return TOOLS.map(t => ({
            name: t.name,
            visits: randomBetween(200, 3500),
            color: t.color
        })).sort((a, b) => b.visits - a.visits);
    }

    // Revenue data
    function genRevenueData(days) {
        const dates = generateDates(days);
        return {
            categories: dates.map(d => formatDateShort(d)),
            amounts: dates.map(() => randomBetween(0, 12000))
        };
    }

    // Payment transactions
    const WORKSHOPS = ['ML Bootcamp', 'AI Workshop', 'Web Dev Sprint', 'Data Science 101'];
    const STATUSES = ['success', 'success', 'success', 'success', 'pending', 'failed', 'refunded'];
    const NAMES = [
        'Aarav Sharma', 'Priya Patel', 'Rohan Mehta', 'Sneha Gupta', 'Arjun Singh',
        'Kavya Nair', 'Rahul Verma', 'Ananya Reddy', 'Vikram Joshi', 'Neha Kapoor',
        'Aditya Kumar', 'Ishita Das', 'Siddharth Rao', 'Diya Iyer', 'Manish Chauhan',
        'Pooja Mishra', 'Karan Malhotra', 'Ritu Agarwal', 'Devansh Tiwari', 'Simran Kaur',
        'Harsh Pandey', 'Megha Saxena', 'Vivek Dubey', 'Anjali Bhatt', 'Rajat Sinha',
        'Tanvi Deshmukh', 'Abhinav Jain', 'Nisha Choudhary', 'Yash Goyal', 'Pallavi Rawat',
        'Rishi Bansal', 'Shruti Thakur', 'Gaurav Yadav', 'Preeti Bose', 'Nikhil Kulkarni',
        'Meenal Rathore', 'Akash Dhawan', 'Sonal Mathur', 'Tushar Sethi', 'Deepika Pillai',
        'Varun Srivastava', 'Komal Ahuja', 'Sameer Rajput', 'Bhavna Khanna', 'Amit Oberoi',
        'Jyoti Luthra', 'Pranav Deshpande', 'Swati Tandon'
    ];

    function genPayments(count) {
        const payments = [];
        for (let i = 0; i < count; i++) {
            const d = new Date();
            d.setDate(d.getDate() - randomBetween(0, 60));
            const status = STATUSES[randomBetween(0, STATUSES.length - 1)];
            payments.push({
                id: 'TXN' + (100000 + i),
                name: NAMES[i % NAMES.length],
                email: NAMES[i % NAMES.length].toLowerCase().replace(/ /g, '.') + '@gmail.com',
                workshop: WORKSHOPS[randomBetween(0, WORKSHOPS.length - 1)],
                amount: [499, 999, 1499, 1999, 2499][randomBetween(0, 4)],
                date: d,
                status: status
            });
        }
        return payments.sort((a, b) => b.date - a.date);
    }

    // Registered users
    function genUsers(count) {
        const users = [];
        const EXP = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
        const USER_STATUS = ['active', 'active', 'active', 'pending'];
        for (let i = 0; i < count; i++) {
            const d = new Date();
            d.setDate(d.getDate() - randomBetween(0, 90));
            users.push({
                name: NAMES[i % NAMES.length],
                email: NAMES[i % NAMES.length].toLowerCase().replace(/ /g, '.') + '@gmail.com',
                phone: '+91 ' + randomBetween(70000, 99999) + ' ' + randomBetween(10000, 99999),
                workshop: WORKSHOPS[randomBetween(0, WORKSHOPS.length - 1)],
                experience: EXP[randomBetween(0, EXP.length - 1)],
                date: d,
                status: USER_STATUS[randomBetween(0, USER_STATUS.length - 1)]
            });
        }
        return users.sort((a, b) => b.date - a.date);
    }


    /* ═══════════════════════════════════════════
       CHARTS
       ═══════════════════════════════════════════ */

    let chartVisitors, chartTools, chartRevenue;

    // 1. Website Visitors — Area chart
    function renderVisitorsChart(days = 30) {
        const data = genVisitorData(days);
        const opts = {
            ...getChartDefaults(),
            chart: {
                ...getChartDefaults().chart,
                type: 'area',
                height: 280,
                sparkline: { enabled: false }
            },
            series: [
                { name: 'Unique Visitors', data: data.unique },
                { name: 'Returning', data: data.returning }
            ],
            xaxis: {
                categories: data.categories,
                labels: { rotate: -45, rotateAlways: false, hideOverlappingLabels: true, style: { fontSize: '10px' } },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: { labels: { style: { fontSize: '11px' } } },
            stroke: { curve: 'smooth', width: 2.5 },
            colors: ['#818cf8', '#c084fc'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.25,
                    opacityTo: 0.02,
                    stops: [0, 100]
                }
            },
            dataLabels: { enabled: false },
            legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px' }
        };

        if (chartVisitors) chartVisitors.destroy();
        chartVisitors = new ApexCharts($('#chartWebsiteVisitors'), opts);
        chartVisitors.render();
    }

    // 2. Tools Visitors — Horizontal Bar chart
    function renderToolsChart() {
        const data = genToolsData();
        const opts = {
            ...getChartDefaults(),
            chart: {
                ...getChartDefaults().chart,
                type: 'bar',
                height: 280
            },
            series: [{ name: 'Visits', data: data.map(d => d.visits) }],
            xaxis: {
                categories: data.map(d => d.name),
                labels: { style: { fontSize: '11px' } },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: { labels: { style: { fontSize: '11px' } } },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 6,
                    barHeight: '60%',
                    distributed: true
                }
            },
            colors: data.map(d => d.color),
            dataLabels: {
                enabled: true,
                style: { fontSize: '11px', fontWeight: 600, fontFamily: 'Figtree, sans-serif' },
                formatter: (val) => val.toLocaleString()
            },
            legend: { show: false },
            stroke: { show: false }
        };

        if (chartTools) chartTools.destroy();
        chartTools = new ApexCharts($('#chartToolsVisitors'), opts);
        chartTools.render();
    }

    // 3. Revenue — Bar chart (vertical)
    function renderRevenueChart(days = 30) {
        const data = genRevenueData(days);
        const opts = {
            ...getChartDefaults(),
            chart: {
                ...getChartDefaults().chart,
                type: 'bar',
                height: 280
            },
            series: [{ name: 'Revenue', data: data.amounts }],
            xaxis: {
                categories: data.categories,
                labels: { rotate: -45, rotateAlways: false, hideOverlappingLabels: true, style: { fontSize: '10px' } },
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: {
                    style: { fontSize: '11px' },
                    formatter: (val) => '₹' + (val / 1000).toFixed(0) + 'k'
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    columnWidth: '55%',
                    colors: {
                        ranges: [
                            { from: 0, to: 3000, color: 'rgba(129,140,248,0.3)' },
                            { from: 3001, to: 6000, color: 'rgba(129,140,248,0.5)' },
                            { from: 6001, to: 9000, color: 'rgba(129,140,248,0.7)' },
                            { from: 9001, to: 99999, color: '#818cf8' }
                        ]
                    }
                }
            },
            colors: ['#818cf8'],
            dataLabels: { enabled: false },
            tooltip: {
                y: { formatter: (val) => formatCurrency(val) }
            }
        };

        if (chartRevenue) chartRevenue.destroy();
        chartRevenue = new ApexCharts($('#chartRevenue'), opts);
        chartRevenue.render();
    }


    /* ═══════════════════════════════════════════
       DATA TABLES
       ═══════════════════════════════════════════ */

    const ROWS_PER_PAGE = 10;

    // ── Payments Table ──
    let allPayments = genPayments(48);
    let filteredPayments = [...allPayments];
    let paymentPage = 1;

    function getStatusBadge(status) {
        const labels = { success: 'Completed', pending: 'Pending', failed: 'Failed', refunded: 'Refunded' };
        return `<span class="table-badge table-badge--${status}"><span class="table-badge__dot"></span>${labels[status]}</span>`;
    }

    function getAvatarColor(name) {
        const colors = ['#818cf8', '#c084fc', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#fb923c', '#2dd4bf'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }

    function getInitials(name) {
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }

    function renderPaymentsTable() {
        const tbody = $('#paymentsTableBody');
        const start = (paymentPage - 1) * ROWS_PER_PAGE;
        const page = filteredPayments.slice(start, start + ROWS_PER_PAGE);

        if (page.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="table-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <div class="table-empty__text">No transactions found for this date range</div></div></td></tr>`;
        } else {
            tbody.innerHTML = page.map(p => `
                <tr>
                    <td><code style="color:var(--admin-accent);font-size:0.75rem">${p.id}</code></td>
                    <td>
                        <div class="table-user">
                            <div class="table-user__avatar" style="background:${getAvatarColor(p.name)}">${getInitials(p.name)}</div>
                            <div>
                                <div class="table-user__name">${p.name}</div>
                                <div class="table-user__email">${p.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${p.workshop}</td>
                    <td class="table-amount">${formatCurrency(p.amount)}</td>
                    <td>${formatDate(p.date)}</td>
                    <td>${getStatusBadge(p.status)}</td>
                </tr>
            `).join('');
        }

        // Info
        const total = filteredPayments.length;
        const showing = Math.min(start + ROWS_PER_PAGE, total);
        $('#paymentsInfo').textContent = total > 0
            ? `Showing ${start + 1}–${showing} of ${total} transactions`
            : 'No transactions found';

        // Pagination
        renderPagination('paymentsPagination', total, paymentPage, (p) => { paymentPage = p; renderPaymentsTable(); });
    }

    // ── Users Table ──
    let allUsers = genUsers(28);
    let filteredUsers = [...allUsers];
    let userPage = 1;

    function renderUsersTable() {
        const tbody = $('#usersTableBody');
        const start = (userPage - 1) * ROWS_PER_PAGE;
        const page = filteredUsers.slice(start, start + ROWS_PER_PAGE);

        if (page.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="table-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <div class="table-empty__text">No users found</div></div></td></tr>`;
        } else {
            tbody.innerHTML = page.map(u => `
                <tr>
                    <td>
                        <div class="table-user">
                            <div class="table-user__avatar" style="background:${getAvatarColor(u.name)}">${getInitials(u.name)}</div>
                            <div>
                                <div class="table-user__name">${u.name}</div>
                                <div class="table-user__email">${u.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${u.phone}</td>
                    <td>${u.workshop}</td>
                    <td><span class="table-badge table-badge--${u.experience === 'Beginner' ? 'pending' : u.experience === 'Advanced' || u.experience === 'Professional' ? 'success' : 'refunded'}">${u.experience}</span></td>
                    <td>${formatDate(u.date)}</td>
                    <td>${u.status === 'active'
                    ? '<span class="table-badge table-badge--success"><span class="table-badge__dot"></span>Active</span>'
                    : '<span class="table-badge table-badge--pending"><span class="table-badge__dot"></span>Pending</span>'
                }</td>
                </tr>
            `).join('');
        }

        const total = filteredUsers.length;
        const showing = Math.min(start + ROWS_PER_PAGE, total);
        $('#usersInfo').textContent = total > 0
            ? `Showing ${start + 1}–${showing} of ${total} users`
            : 'No users found';

        renderPagination('usersPagination', total, userPage, (p) => { userPage = p; renderUsersTable(); });
    }

    // ── Pagination renderer ──
    function renderPagination(containerId, totalItems, currentPage, onPageChange) {
        const container = document.getElementById(containerId);
        const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
        if (totalPages <= 1) { container.innerHTML = ''; return; }

        let html = '';

        // Prev
        html += `<button class="table-pagination__btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>`;

        // Page numbers
        const maxVisible = 5;
        let startP = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endP = Math.min(totalPages, startP + maxVisible - 1);
        if (endP - startP < maxVisible - 1) startP = Math.max(1, endP - maxVisible + 1);

        for (let i = startP; i <= endP; i++) {
            html += `<button class="table-pagination__btn ${i === currentPage ? 'is-active' : ''}" data-page="${i}">${i}</button>`;
        }

        // Next
        html += `<button class="table-pagination__btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>`;

        container.innerHTML = html;

        // Bind events
        container.querySelectorAll('.table-pagination__btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const p = parseInt(btn.dataset.page);
                if (!isNaN(p) && p >= 1 && p <= totalPages) {
                    onPageChange(p);
                }
            });
        });
    }


    /* ═══════════════════════════════════════════
       EVENT LISTENERS
       ═══════════════════════════════════════════ */

    // (Sidebar removed — using site navbar from main.css)

    // Chart filter buttons
    $$('.chart-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chart = btn.dataset.chart;
            // Toggle active within group
            btn.closest('.chart-actions').querySelectorAll('.chart-filter-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const range = btn.dataset.range;
            const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
            const days = daysMap[range] || 30;

            if (chart === 'visitors') renderVisitorsChart(days);
            else if (chart === 'tools') renderToolsChart();
            else if (chart === 'revenue') renderRevenueChart(days);
        });
    });

    // Payment date filter
    $('#filterPayments').addEventListener('click', () => {
        const from = $('#paymentDateFrom').value;
        const to = $('#paymentDateTo').value;

        filteredPayments = allPayments.filter(p => {
            const d = p.date.toISOString().split('T')[0];
            if (from && d < from) return false;
            if (to && d > to) return false;
            return true;
        });

        paymentPage = 1;
        renderPaymentsTable();
    });

    // User search
    let searchDebounce;
    $('#userSearch').addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            const q = e.target.value.toLowerCase().trim();
            filteredUsers = allUsers.filter(u =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.phone.includes(q) ||
                u.workshop.toLowerCase().includes(q)
            );
            userPage = 1;
            renderUsersTable();
        }, 250);
    });

    // Refresh button
    $('#refreshDashboard').addEventListener('click', () => {
        // Regenerate all data
        allPayments = genPayments(48);
        filteredPayments = [...allPayments];
        paymentPage = 1;

        allUsers = genUsers(28);
        filteredUsers = [...allUsers];
        userPage = 1;

        renderVisitorsChart(30);
        renderToolsChart();
        renderRevenueChart(30);
        renderPaymentsTable();
        renderUsersTable();

        // Flash animation
        const btn = $('#refreshDashboard');
        btn.style.transform = 'rotate(360deg)';
        btn.style.transition = 'transform 500ms ease';
        setTimeout(() => { btn.style.transform = ''; btn.style.transition = ''; }, 600);
    });


    /* ═══════════════════════════════════════════
       INIT
       ═══════════════════════════════════════════ */

    function init() {
        // Set default date filter values
        const today = new Date();
        const thirtyAgo = new Date();
        thirtyAgo.setDate(today.getDate() - 30);
        $('#paymentDateTo').value = today.toISOString().split('T')[0];
        $('#paymentDateFrom').value = thirtyAgo.toISOString().split('T')[0];

        // Render charts
        renderVisitorsChart(30);
        renderToolsChart();
        renderRevenueChart(30);

        // Render tables
        renderPaymentsTable();
        renderUsersTable();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
