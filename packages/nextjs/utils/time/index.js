export default class Time {
    static formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZoneName: 'short',
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        // const suffix = this.getOrdinalSuffix(date.getDate());
        return `${formattedDate}`
      }
  
    static getOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }
  
    static getTimeDifference(timestamp) {
      const now = Date.now() / 1000;
      const difference = timestamp - now;
      const days = Math.floor(difference / (24 * 60 * 60)).toString().padStart(2, '0');
      const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((difference % (60 * 60)) / 60).toString().padStart(2, '0');
      const seconds = Math.floor(difference % 60).toString().padStart(2, '0');
      return { days, hours, minutes, seconds };
    }
  
    static getTimestampInSeconds(dateTimeString) {
      const date = new Date(dateTimeString);
      return Math.floor(date.getTime() / 1000);
    }
  }