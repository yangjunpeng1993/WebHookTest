document.write("<script type='text/javascript' src='./html2canvas.js'></script>");
let now=new Date();  
 
let lunarinfo=new Array(0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0);      
 
//==== 传回农历 y年的总天数
function lyeardays(y) {
let i, sum = 348
for(i=0x8000; i>0x8; i>>=1) sum += (lunarinfo[y-1900] & i)? 1: 0
return(sum+leapdays(y))
}
//==== 传回农历 y年闰月的天数
function leapdays(y) {
if(leapmonth(y))  return((lunarinfo[y-1900] & 0x10000)? 30: 29)
else return(0)
}
//==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
function leapmonth(y) { return(lunarinfo[y-1900] & 0xf)}
//====================================== 传回农历 y年m月的总天数
function monthdays(y,m) { return( (lunarinfo[y-1900] & (0x10000>>m))? 30: 29 )}
//==== 算出农历, 传入日期物件, 传回农历日期物件
//     该物件属性有 .year .month .day .isleap .yearcyl .daycyl .moncyl
function lunar(objdate) {
let i, leap=0, temp=0;
let basedate = new Date(1900,0,31);
let offset   = (objdate - basedate)/86400000;
this.daycyl = offset + 40;
this.moncyl = 14;
for(i=1900; i<2050 && offset>0; i++) {
temp = lyeardays(i);
offset -= temp;
this.moncyl += 12;
}
if(offset<0) {
offset += temp;
i--;
this.moncyl -= 12;
}
this.year = i;
this.yearcyl = i-1864;
leap = leapmonth(i); //闰哪个月
this.isleap = false
for(i=1; i<13 && offset>0; i++) {
//闰月
if(leap>0 && i==(leap+1) && this.isleap==false)
{ --i; this.isleap = true; temp = leapdays(this.year); }
else
{ temp = monthdays(this.year, i); }
//解除闰月
if(this.isleap==true && i==(leap+1)) this.isleap = false
offset -= temp
if(this.isleap == false) this.moncyl ++
}
if(offset==0 && leap>0 && i==leap+1)
if(this.isleap)
{ this.isleap = false; }
else
{ this.isleap = true; --i; --this.moncyl;}
if(offset<0){ offset += temp; --i; --this.moncyl; }
this.month = i
this.day = offset + 1
}
function cday(m,d){
let nstr1 = new Array('日','一','二','三','四','五','六','七','八','九','十');
let nstr2 = new Array('初','十','廿','卅','　');
let s;
if (m>10){s = '十'+nstr1[m-10]} else {s = nstr1[m]} s += '月'
if (s=="十二月") s = "腊月";
if (s=="一月") s = "正月";
switch (d) {
case 10:s += '初十'; break;
case 20:s += '二十'; break;
case 30:s += '三十'; break;
default:s += nstr2[Math.floor(d/10)]; s += nstr1[d%10];
}
return(s);
}
function solarday2(){
let sdobj = new Date(now.getFullYear(),now.getMonth(),now.getDate());
let ldobj = new lunar(sdobj);
let cl = '';
//农历bb'+(cld[d].isleap?'闰 ':' ')+cld[d].lmonth+' 月 '+cld[d].lday+' 日
let tt = cday(ldobj.month,ldobj.day);
//document.write(now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日 农历"+tt+"");
return '农历'+ tt;
}  
// JavaScript Document
 
let CalendarData=new Array(100);
let madd=new Array(12);
let tgString="甲乙丙丁戊己庚辛壬癸";
let dzString="子丑寅卯辰巳午未申酉戌亥";
let numString="一二三四五六七八九十";
let monString="正二三四五六七八九十冬腊";
let weekString="日一二三四五六";
let sx="鼠牛虎兔龙蛇马羊猴鸡狗猪";
let cYear,cMonth,cDay,TheDate;
CalendarData = new Array(0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E, 0x92E,0x7192D,0xC95,0xD4A,0x61B4A,0xB55,0x56A,0x4155B, 0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5,0xB54,0xB6A,0x612DA,0x95B,0x49B,0x41497,0xA4B,0xA164B, 0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,0x497,0x64B, 0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B, 0x60A57,0x52B,0xA93,0x40E95);
madd[0]=0;
madd[1]=31;
madd[2]=59;
madd[3]=90;
madd[4]=120;
madd[5]=151;
madd[6]=181;
madd[7]=212;
madd[8]=243;
madd[9]=273;
madd[10]=304;
madd[11]=334; 
 
function GetBit(m,n){
return (m>>n)&1;
}
function e2c(){
TheDate= (arguments.length!=3) ? new Date() : new Date(arguments[0],arguments[1],arguments[2]);
let total,m,n,k;
let isEnd=false;
let tmp=TheDate.getYear();
if(tmp<1900){
   tmp+=1900;
}
total=(tmp-1921)*365+Math.floor((tmp-1921)/4)+madd[TheDate.getMonth()]+TheDate.getDate()-38;
 
if(TheDate.getYear()%4==0&&TheDate.getMonth()>1) {
   total++;
}
for(m=0;;m++){
   k=(CalendarData[m]<0xfff)?11:12;
   for(n=k;n>=0;n--){
    if(total<=29+GetBit(CalendarData[m],n)){
     isEnd=true; break;
    }
    total=total-29-GetBit(CalendarData[m],n);
   }
   if(isEnd) break;
}
cYear=1921 + m;
cMonth=k-n+1;
cDay=total;
if(k==12){
   if(cMonth==Math.floor(CalendarData[m]/0x10000)+1){
    cMonth=1-cMonth;
   }
   if(cMonth>Math.floor(CalendarData[m]/0x10000)+1){
    cMonth--;
   }
}
}
 
function GetcDateString(){
let tmp="";
tmp+=tgString.charAt((cYear-4)%10);
tmp+=dzString.charAt((cYear-4)%12);
// tmp+="(";
// tmp+=sx.charAt((cYear-4)%12);
// tmp+=")年 ";
tmp+=" | "
if(cMonth<1){
   tmp+="(闰)";
   tmp+=monString.charAt(-cMonth-1);
}else{
   tmp+=monString.charAt(cMonth-1);
}
tmp+="月";
tmp+=(cDay<11)?"初":((cDay<20)?"十":((cDay<30)?"廿":"三十"));
if (cDay%10!=0||cDay==10){
   tmp+=numString.charAt((cDay-1)%10);
}
return tmp;
}
 
function GetLunarDay(solarYear,solarMonth,solarDay){
//solarYear = solarYear<1900?(1900+solarYear):solarYear;
if(solarYear<1921 || solarYear>2020){
return "";
}else{
   solarMonth = (parseInt(solarMonth)>0) ? (solarMonth-1) : 11;
   e2c(solarYear,solarMonth,solarDay);
   return GetcDateString();
}
}

window.onload = function() {
    let myDate = new Date();
    const day_div = document.querySelector('.header-right');
    let day;
    if(myDate.getDate()<10) {
        day = '0'+ myDate.getDate();
    } else {
        day = myDate.getDate();
    }

    day_div.innerHTML = day;

    const monthAndWeek = document.querySelector('#month-week');
    let month = myDate.getMonth() + 1;
    let week = myDate.getDay();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    monthAndWeek.innerHTML = month + ' 月 '+ '| '+'周'+ weekDays[week];

    let yy=myDate.getFullYear();
    let mm=myDate.getMonth()+1;
    let dd=myDate.getDate();
    let ww=myDate.getDay();
    let ss=parseInt(myDate.getTime() / 1000);
    if (yy<100) yy="19"+yy;
    const chinese_date = document.querySelector('#chinese-date');
    chinese_date.innerHTML = GetLunarDay(yy,mm,dd);

    const input = document.querySelector('#input-content');
    input.addEventListener('input', updateValue);

    function updateValue(e) {
        const main_content = document.querySelector('#main-content');
        main_content.innerHTML = e.target.value;
    } 

    const input_author = document.querySelector('#input-author');
    input_author.addEventListener('input', updateAuthor);

    function updateAuthor(e) {
        const author = document.querySelector('#author');
        author.innerHTML = e.target.value;
    } 

    const input_img_url = document.querySelector('#input-img-url');
    input_img_url.addEventListener('input', updateImage);

    function updateImage(e) {
        const footer_img = document.querySelector('.footer-img');
        footer_img.style.background = 'url("'+e.target.value+'")';
        footer_img.style.backgroundSize = 'cover';
        footer_img.style.backgroundPosition = 'center center';
    } 

    const downloadBtn = document.querySelector('#download');
    downloadBtn.addEventListener('click', snapshoot);

   let content = document.querySelector('.main');
   let width = content.offsetWidth,//canvasContent.offsetWidth || document.body.clientWidth; //获取dom 宽度
   height = content.offsetHeight;//canvasContent.offsetHeight; //获取dom 高度
   // canvas = document.createElement("canvas"), //创建一个canvas节点
   // scale = 4; //定义任意放大倍数 支持小数
   // canvas.width = width * scale; //定义canvas 宽度 * 缩放
   // canvas.height = height * scale; //定义canvas高度 *缩放
   // canvas.style.width = content.offsetWidth * scale + "px";
   // canvas.style.height = content.offsetHeight * scale + "px";
   // canvas.getContext("2d").scale(scale, scale); //获取context,设置scale
   const scale = 2;
   let opts = {
      scale: scale, // 添加的scale 参数
      // canvas: canvas, //自定义 canvas
      logging: false, //日志开关，便于查看html2canvas的内部执行流程
      // width: width, //dom 原始宽度
      // height: height,
      useCORS: true // 【重要】开启跨域配置
   };

   function snapshoot(){
      content.style.border = "none";
      const header_div = document.querySelector('.header');
      header_div.style.borderBottom = 'none';
      // border-bottom: 1px dashed #D4D3C3;
      html2canvas(content, opts).then(function(canvas){
         dashed(header_div, canvas);
         drawBorder(content, canvas, 1);
         drawBorder(content, canvas, 5);
         let imgUrl = canvas.toDataURL('image/png');
         // window.location.href = imgUrl;
         var dlLink = document.createElement('a');
         dlLink.download = month + '-' + myDate.getDate();
         dlLink.href = imgUrl;
         dlLink.dataset.downloadurl = ['image/png', dlLink.download, dlLink.href].join(':');
         document.body.appendChild(dlLink);
         dlLink.click();
         document.body.removeChild(dlLink);

         // 复原
         content.style.border = "thick double #B3B7B9";
         header_div.style.borderBottom = '1px dashed #D4D3C3';
      }) 
   }

   function dashed(domContent, canvas) {
      let top = 24,
         right = domContent.offsetRight,
         left = domContent.offsetLeft,
         width = domContent.offsetWidth,
         height = domContent.offsetHeight;

      var ctx = canvas.getContext("2d");
      ctx.setLineDash([2.5,1]);
      ctx.strokeStyle = '#D4D3C3';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(left, top + height);
      ctx.lineTo(left + width, top + height);
      ctx.stroke()
   }

   function drawBorder(domContent, canvas, offset) {
      let top = domContent.offsetTop + offset,
         left = domContent.offsetLeft + offset,
         width = domContent.offsetWidth - offset*2,
         height = domContent.offsetHeight - offset*2;

      var ctx = canvas.getContext("2d");

      console.log('left: '+ left);
      console.log('top: '+ top);
      console.log('width: '+ width);
      console.log('height: '+ width);


      ctx.setLineDash([]);
      ctx.strokeStyle = '#B3B7B9';
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, width, height);
   }

}

