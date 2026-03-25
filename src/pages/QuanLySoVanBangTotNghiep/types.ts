// types.ts
export interface SoVanBang {
    id: string;
    nam: number;
    tenSo: string;
    dangSuDung: boolean;
  }
  
  export interface QuyetDinh {
    id: string;
    soQuyetDinh: string;
    ngayBanHanh: string; // ISO String
    trichYeu: string;
    soVanBangId: string;
    luotTraCuu: number; // Theo dõi tổng số lượt tra cứu
  }
  
  export type KieuDuLieu = 'String' | 'Number' | 'Date';
  
  export interface TruongThongTinDong {
    id: string;
    tenTruong: string;
    kieuDuLieu: KieuDuLieu;
    batBuoc: boolean;
  }
  
  export interface VanBang {
    id: string;
    quyetDinhId: string;
    soVaoSo: number; // Tự động tăng
    soHieu: string;
    maSinhVien: string;
    hoTen: string;
    ngaySinh: string; // ISO String
    thongTinPhuLuc: Record<string, any>; // Lưu trữ dữ liệu động (Key là ID của TruongThongTinDong)
  }