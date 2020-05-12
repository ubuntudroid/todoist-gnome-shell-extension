function isDueDateInPast(item) {
    if (item.due === null) return false;

    let dueDate = new Date(item.due.date);
    dueDate.setHours(0,0,0,0);
    let today = new Date;
    today.setHours(0,0,0,0);

    return dueDate <= today;
}