export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/doan-so',
		name: 'Đoán số',
		component: './DoanSo',
		icon: 'QuestionOutlined',
	},
	{
		path: '/quan-ly-hoc-tap',
		name: 'Quản lý học tập',
		component: './QuanLyHocTap',
		icon: 'BookOutlined',
	},
	{
		path: '/chess',
		name: 'Chess',
		icon: 'crown',
		component: './Chess/chess',
	},
	{
		path: '/slot-machine',
		name: 'Slot Machine',
		icon: 'SlidersOutlined',
		component: './SlotMachine/slotMachine',
	},
	{
		path: '/keo-bua-bao',
		name: 'Kéo Búa Bao',
		icon: 'PlayCircleOutlined',
		component: './KeoBuaBao',
	},
	{
		path: '/ngan-hang-cau-hoi',
		name: 'Ngân hàng câu hỏi',
		icon: 'UnorderedListOutlined',
		component: './NganHangCauHoi',
	},
	{
		path: '/quan-ly-lich-hen',
		name: 'nganHangCauHoi',
		icon: 'CalendarOutlined',
		component: './QuanLyLichHen',
	},

	{
		path: '/quan-ly-lich-hen',
		name: 'nganHangCauHoi',
		icon: 'CalendarOutlined',
		component: './QuanLyLichHen',
	},
	{
		path: '/quan-ly-van-bang',
		name: 'quanLyVanBang',
		icon: 'BookOutlined',
		component: './QuanLySoVanBangTotNghiep',
	},
	{
		path: '/quan-ly-cau-lac-bo',
		name: 'quanLyCauLacBo',
		icon: 'TeamOutlined',
		component: './QuanLyCauLacBo',
	},
	{
		path: '/lap-ke-hoach-du-lich',
		name: 'lapKeHoachDuLich',
		icon: 'ScheduleOutlined',
		component: './LapKeHoachDuLich',
	},
	{
		path: '/quan-ly-don-hang',
		name: 'quanLyDonHang',
		icon: 'ShoppingCartOutlined',
		component: './QuanLyDonHang',
	},
	{
		path: '/blog-ca-nhan',
		name: 'blogCaNhan',
		icon: 'ReadOutlined',
		component: './BlogCaNhan',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
