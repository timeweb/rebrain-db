export default {
    props: ['students', 'currentStudentsIds', 'classId'],
    data: () => ({
        studentsIds: []
    }),
    created() {
        this.studentsIds = this.$props.currentStudentsIds
    },
    methods: {
        set_students() {
            this.$emit('set-students', {students: this.studentsIds, class_id: this.classId})
            this.$emit('close')
        },
    },
    template: `
        <form action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Выбор учеников</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                    <div class="select is-multiple">
                        <select v-model="studentsIds" class="select" placeholder="Ученики" multiple>
                            <option v-for="student in students"
                                :value="student.id"
                                :key="student.id"
                            >{{ student.fio }}
                            </option>
                        </select>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Отмена"
                        @click="$emit('close')" />
                    <b-button
                        label="Сохранить"
                        @click="set_students()"
                        type="is-primary" />
                </footer>
            </div>
        </form>
    `
}


