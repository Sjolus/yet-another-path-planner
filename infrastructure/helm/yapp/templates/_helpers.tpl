{{/*
Expand the name of the chart.
*/}}
{{- define "yapp.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "yapp.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "yapp.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "yapp.labels" -}}
helm.sh/chart: {{ include "yapp.chart" . }}
{{ include "yapp.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "yapp.selectorLabels" -}}
app.kubernetes.io/name: {{ include "yapp.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Construct a full image reference for a given component.
Usage: {{ include "yapp.image" (dict "component" "frontend" "global" .Values.global) }}
*/}}
{{- define "yapp.image" -}}
{{- printf "%s/%s:%s" .global.imageRegistry .component (default "latest" .global.imageTag) }}
{{- end }}

{{/*
Secret name for shared secrets.
Uses global.yapp.secretName if set, otherwise defaults to <release-name>-secrets.
This ensures subcharts and the umbrella chart reference the same Secret.
*/}}
{{- define "yapp.secretName" -}}
{{- if .Values.global.yapp.secretName }}
{{- .Values.global.yapp.secretName }}
{{- else }}
{{- printf "%s-secrets" .Release.Name }}
{{- end }}
{{- end }}
