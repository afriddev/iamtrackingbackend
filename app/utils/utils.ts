export function daysInThisMonth() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
}

export function getTodayDate(): number{
  return new Date().getDate()
  
}
export function useGetMe(){
  const emailId = "369afrid@gmail.com"
  return {emailId}

}
