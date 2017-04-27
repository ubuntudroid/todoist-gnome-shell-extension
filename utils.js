function isDueDateInPast(item) {
    let dueDateString = item.due_date_utc;
    if (dueDateString === null) {
        return false;
    }

    let dueDate = new Date(dueDateString);
    dueDate.setHours(0,0,0,0);
    let today = new Date;
    today.setHours(0,0,0,0);
    return dueDate <= today;
}