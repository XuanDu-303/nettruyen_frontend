import React from 'react'

const Footer = () => {
  return (
    <div className='w-full px-32 py-4 bg-black opacity-90'>
      <div className="flex justify-between">
        <div className="w-[30%] flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <img className="w-[150px]" src="https://nettruyenx.com/assets/images/logo-nettruyen.png" alt="" />
            <p className='text-[14px] text-white font-medium'><span> Giới thiệu</span> | <span>Liên hệ</span></p>
            <p className='text-[14px] text-white font-medium'><span> Điều khoản</span> | <span>Chính sách bảo mật</span></p>
          </div>
          <div className="flex flex-col gap-2">

            <h1 className='text-white text-[28px] font-bold'>Liên hệ đặt quảng cáo</h1>
            <p className='text-[14px] text-white font-normal'>Telegram: @evoadagency</p>
            <p className='text-[14px] text-white font-normal'>Email: nettruyenads@gmail.com</p>
            <p className='text-[14px] text-white font-normal'>Copyright © 2024 NetTruyen</p>
          </div>
        </div>
        <div className="right w-[60%]">
          <h1 className='text-white text-[20px] font-semibold'>Từ khóa</h1>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>Truyện tranh</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>nettruyen</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center '>Truyện tranh online</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>Truyện tranh đam mỹ</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>Manhwa</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>Manhua</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center '>Truyện tranh ngôn tình</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>nettruyn ngôn tình</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center '>truyneeenfull.vip</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>bondalu</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>Xoilac TV</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>Cakhiatv</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center'>Mitom TV</p>
              </div>
              <div className="p-1 border border-white rounded-md">
                <p className='text-[13px] text-white font-normal text-center '>truc tiep bong da</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer