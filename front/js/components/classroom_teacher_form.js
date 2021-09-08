export default {
    props: ['teachers', 'currentTeacher', 'classId'],
    data: () => ({
        teacher_id: null
    }),
    methods: {
        set_teacher(teacher_id) {
            this.teacher_id = parseInt(teacher_id)
        },
        set_classroom_teacher() {
            this.$emit('set-classroom-teacher', {teacher_id: this.teacher_id, class_id: this.classId})
            this.$emit('close')
        },
    },
    template: `
        <form action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Выбор классного руководителя</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                     <select class="select" placeholder="Классный руководитель" @change="set_teacher($event.target.value)">
                         <option v-if="currentTeacher !== null" :value="currentTeacher.id" :key="currentTeacher.id" selected>{{ currentTeacher.fio }}</option>
                         <option :selected="teacher.id == currentTeacher.id" v-for="teacher in teachers" :value="teacher.id" :key="teacher.id">{{ teacher.fio }}</option>
                     </select>
                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Отмена"
                        @click="$emit('close')" />
                    <b-button
                        label="Сохранить"
                        @click="set_classroom_teacher()"
                        type="is-primary" />
                </footer>
            </div>
        </form>
    `
}

