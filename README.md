###基于jquery封装js常用场景的插件库
使用方法
首先引入jquery.js
其次再引入jquery-common.js
里面提供了很多api
1. rewriteUrl(url, params, ignoreUrlPara)
2. getQueryPara(name)
3. alert(msg, type[选填])
4. confirm(msg, callback[选填])
5. cookie(key, value, expires)
6. delCookie(key)
7. logOut
8. date(date) 操作日期
  - addDays(date, days)
  - dayOfWeek(day)
  - sameDay(date1, date2)
  - dayCompare(date1, date2)
  - getMonthDays(year, month)
  - getSiblingsMonday(date)
9. validate(reg, value) 正则验证
  - isInt(value, allowMinus)
  - IntValidate(value, min, max)
  - isNumber(value)
  - isIDCardNumber(value)
  - isPhoneNumber(value, cellPhone)
  - isMobileNumber(value)
  - isEmail(email)
10. datePickerInit 

####调用方式
`
  SCI.date(new Date())
`
