export default {
    props: ['subjects', 'teachers', 'lessons', 'class_id'],
    data: () => ({
        times: ['9:00', '9:55', '10:40', '11:45', '12:05', '13:00'],
        weekdays: {
            mon: 'Понедельник',
            tue: 'Вторник',
            wed: 'Среда',
            thu: 'Четверг',
            fri: 'Пятница',
        },
    }),
    methods: {
        get_lesson(weekday, num) {
            let lesson = this.lessons.find(lesson => lesson.weekday == weekday && lesson.num == num)
            if (typeof lesson == 'undefined') {
                lesson = {
                    id: null,
                    weekday: weekday,
                    num: num,
                    class_id: this.class_id,
                    subject_id: null,
                    teacher_id: null,
                }
                this.lessons.push(lesson)
            }
            return lesson
        },
        get_teacher(weekday, num) {
            let lesson = this.lessons.find(lesson => lesson.weekday == weekday && lesson.num == num)
            if (typeof lesson == 'undefined') {
                return null
            }
            return lesson.teacher_id
        },
        get_subject(weekday, num) {
            let lesson = this.lessons.find(lesson => lesson.weekday == weekday && lesson.num == num)
            if (typeof lesson == 'undefined') {
                return null
            }
            return lesson.subject_id
        },
        set_subject(weekday, num, subject_id) {
            let lesson = this.get_lesson(weekday, num)
            lesson.subject_id = parseInt(subject_id)
        },
        set_teacher(weekday, num, teacher_id) {
            let lesson = this.get_lesson(weekday, num)
            lesson.teacher_id = parseInt(teacher_id)
        },
        set_lesson(weekday, num) {
            let lesson = this.get_lesson(weekday, num)
            this.$emit('set-lesson', lesson)
        },
    },
    template: `
<div>
    <div class="box" v-for="title, weekday in weekdays">
        <h2 class="subtitle">{{ title }}</h2>
        <b-table :data="[0, 1, 2, 3, 4, 5]" striped hoverable>
            <b-table-column field="id" label="#" v-slot="props">{{ times[props.row] }}</b-table-column>
            <b-table-column field="subject" label="Предмет" v-slot="props">
                <b-select placeholder="Предмет" :value="get_subject(weekday, props.row) "@change.native="set_subject(weekday, props.row, $event.target.value)">
                    <option v-for="subject in subjects" :key="subject.id" :value="subject.id">{{ subject.title }}</option>
                </b-select>
            </b-table-column>
            <b-table-column field="teacher" label="Учитель" v-slot="props">
                <b-select placeholder="Учитель" :value="get_teacher(weekday, props.row)" @change.native="set_teacher(weekday, props.row, $event.target.value)">
                    <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.fio }}</option>
                </b-select>
            </b-table-column>
            <b-table-column label="Операции" v-slot="props">
                <b-button label="Сохранить" type="is-primary" @click="set_lesson(weekday, props.row)"></b-button>
            </b-table-column>
        </b-table>
    </div>
</div>
`
}
