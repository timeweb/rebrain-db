export default {
    props: ['teachers', 'currentTeacher', 'classId'],
    data: () => ({
        teacher_id: null
    }),
    created () {
        if (this.$props.currentTeacher !== null) {
            this.teacher_id = this.$props.currentTeacher.id
        }
    },
    methods: {
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
                     <select v-model="teacher_id" class="select" placeholder="Классный руководитель">
                         <option v-if="currentTeacher !== null" :value="currentTeacher.id" :key="currentTeacher.id" selected>{{ currentTeacher.fio }}</option>
                         <option v-for="teacher in teachers" :value="teacher.id" :key="teacher.id">{{ teacher.fio }}</option>
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

